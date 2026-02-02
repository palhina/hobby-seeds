/**
 * LogEntry テスト
 *
 * ログエントリーの表示とインタラクション（削除）をテスト
 */

import React from 'react';
import { Alert } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { LogEntry } from '../LogEntry';
import { renderWithTheme } from '../../__tests__/test-helpers';

import type { HobbyLogEntry, Rating } from '@/types';

// Alertをモック
jest.spyOn(Alert, 'alert');

describe('LogEntry', () => {
  const mockEntry: HobbyLogEntry = {
    hobbyId: 1,
    rating: 'great',
    loggedAt: '2026-02-02T10:30:00.000Z',
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示', () => {
    it('趣味名が表示される', () => {
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText('雲観察')).toBeTruthy();
    });

    it('趣味の絵文字が表示される', () => {
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText('☁️')).toBeTruthy();
    });

    it('評価の絵文字が表示される（great → 😊）', () => {
      const entry: HobbyLogEntry = { ...mockEntry, rating: 'great' };
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={entry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText('😊')).toBeTruthy();
    });

    it('評価の絵文字が表示される（good → 🙂）', () => {
      const entry: HobbyLogEntry = { ...mockEntry, rating: 'good' };
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={entry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText('🙂')).toBeTruthy();
    });

    it('評価の絵文字が表示される（meh → 😐）', () => {
      const entry: HobbyLogEntry = { ...mockEntry, rating: 'meh' };
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={entry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText('😐')).toBeTruthy();
    });

    it('日時がフォーマットされて表示される', () => {
      const { getByText } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      // 2026-02-02T10:30:00.000Z → 2026/02/02 10:30 (ローカルタイムゾーンによって変わる可能性あり)
      expect(getByText(/2026\/02\/02/)).toBeTruthy();
    });
  });

  describe('削除ボタン', () => {
    it('onDeleteが渡されている場合、削除ボタンが表示される', () => {
      const { getByTestId } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
          onDelete={mockOnDelete}
        />
      );

      // IconSymbolが存在することを確認（削除ボタンのアイコン）
      const deleteIcon = getByTestId('icon-trash');
      expect(deleteIcon).toBeTruthy();
    });

    it('onDeleteが渡されていない場合、削除ボタンが表示されない', () => {
      const { queryByTestId } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      const deleteIcon = queryByTestId('icon-trash');
      expect(deleteIcon).toBeNull();
    });
  });

  describe('削除インタラクション', () => {
    it('削除ボタン押下でAlert.alertが表示される', () => {
      const { getByTestId } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
          onDelete={mockOnDelete}
        />
      );

      // 削除ボタンの親要素（SDeleteButton）を取得してpress
      const iconSymbol = getByTestId('icon-trash');
      const deleteButton = iconSymbol.parent;

      if (deleteButton) {
        fireEvent.press(deleteButton);
      }

      expect(Alert.alert).toHaveBeenCalledWith(
        '記録を削除',
        '「雲観察」の記録を削除しますか？',
        expect.any(Array)
      );
    });

    it('Alert確認後、onDeleteが呼ばれる', () => {
      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        // 削除ボタン（配列の2番目）のonPressを実行
        if (buttons && buttons[1]?.onPress) {
          buttons[1].onPress();
        }
      });

      const { getByTestId } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
          onDelete={mockOnDelete}
        />
      );

      const iconSymbol = getByTestId('icon-trash');
      const deleteButton = iconSymbol.parent;

      if (deleteButton) {
        fireEvent.press(deleteButton);
      }

      expect(mockOnDelete).toHaveBeenCalled();
    });

    it('Alertキャンセル時、onDeleteは呼ばれない', () => {
      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        // キャンセルボタン（配列の1番目）のonPressは何もしない
      });

      const { getByTestId } = renderWithTheme(
        <LogEntry
          entry={mockEntry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
          onDelete={mockOnDelete}
        />
      );

      const iconSymbol = getByTestId('icon-trash');
      const deleteButton = iconSymbol.parent;

      if (deleteButton) {
        fireEvent.press(deleteButton);
      }

      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('複数の評価パターン', () => {
    const ratings: Array<{ rating: Rating; emoji: string }> = [
      { rating: 'meh', emoji: '😐' },
      { rating: 'good', emoji: '🙂' },
      { rating: 'great', emoji: '😊' },
    ];

    ratings.forEach(({ rating, emoji }) => {
      it(`rating: ${rating} の場合、${emoji}が表示される`, () => {
        const entry: HobbyLogEntry = { ...mockEntry, rating };
        const { getByText } = renderWithTheme(
          <LogEntry
            entry={entry}
            hobbyName="雲観察"
            hobbyEmoji="☁️"
          />
        );

        expect(getByText(emoji)).toBeTruthy();
      });
    });
  });

  describe('日時フォーマット', () => {
    it('異なる日時が正しくフォーマットされる（2026/01/15 08:00）', () => {
      const entry: HobbyLogEntry = {
        ...mockEntry,
        loggedAt: '2026-01-15T08:00:00.000Z',
      };

      const { getByText } = renderWithTheme(
        <LogEntry
          entry={entry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      expect(getByText(/2026\/01\/15/)).toBeTruthy();
    });

    it('異なる日時が正しくフォーマットされる（UTC 2026/12/31 15:00 → ローカル時刻）', () => {
      // 日本時間（JST）だと翌日になる可能性を考慮して、UTC 15:00を使用
      const entry: HobbyLogEntry = {
        ...mockEntry,
        loggedAt: '2026-12-31T15:00:00.000Z',
      };

      const { getByText } = renderWithTheme(
        <LogEntry
          entry={entry}
          hobbyName="雲観察"
          hobbyEmoji="☁️"
        />
      );

      // UTC 15:00 → JST 翌日00:00 or 日付によっては同日
      // タイムゾーンによって日付が変わる可能性があるため、年月のみチェック
      expect(getByText(/2026\/12\/31|2027\/01\/01/)).toBeTruthy();
    });
  });
});
