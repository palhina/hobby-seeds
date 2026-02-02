/**
 * RatingButtons テスト
 *
 * 評価ボタンの表示とインタラクションをテスト
 */

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { RatingButtons } from '../RatingButtons';
import { renderWithTheme } from '../../__tests__/test-helpers';

// expo-hapticsをモック
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('RatingButtons', () => {
  const mockOnRate = jest.fn();

  beforeEach(() => {
    mockOnRate.mockClear();
    jest.clearAllMocks();
  });

  describe('表示', () => {
    it('3つの評価ボタンが表示される', () => {
      const { getByText } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      expect(getByText('😐')).toBeTruthy();
      expect(getByText('🙂')).toBeTruthy();
      expect(getByText('😊')).toBeTruthy();
    });

    it('各ボタンにラベルが表示される', () => {
      const { getByText } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      expect(getByText('微妙')).toBeTruthy();
      expect(getByText('まあまあ')).toBeTruthy();
      expect(getByText('良かった')).toBeTruthy();
    });
  });

  describe('インタラクション', () => {
    it('mehボタン押下で "meh" が返される', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-meh');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledWith('meh');
      });
      expect(mockOnRate).toHaveBeenCalledTimes(1);
    });

    it('goodボタン押下で "good" が返される', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-good');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledWith('good');
      });
    });

    it('greatボタン押下で "great" が返される', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-great');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledWith('great');
      });
    });

    it('ボタン押下時にハプティックフィードバックが発火する', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-great');
      fireEvent.press(button);

      await waitFor(() => {
        expect(Haptics.impactAsync).toHaveBeenCalledWith(
          Haptics.ImpactFeedbackStyle.Light
        );
      });
    });
  });

  describe('選択状態', () => {
    it('選択されたボタンが正しく表示される（meh）', () => {
      const { getByText } = renderWithTheme(
        <RatingButtons selectedRating="meh" onRate={mockOnRate} />
      );

      const mehEmoji = getByText('😐');
      expect(mehEmoji.parent).toBeTruthy();
    });

    it('選択されたボタンが正しく表示される（good）', () => {
      const { getByText } = renderWithTheme(
        <RatingButtons selectedRating="good" onRate={mockOnRate} />
      );

      const goodEmoji = getByText('🙂');
      expect(goodEmoji.parent).toBeTruthy();
    });

    it('選択されたボタンが正しく表示される（great）', () => {
      const { getByText } = renderWithTheme(
        <RatingButtons selectedRating="great" onRate={mockOnRate} />
      );

      const greatEmoji = getByText('😊');
      expect(greatEmoji.parent).toBeTruthy();
    });

    it('選択状態から別のボタンを押下できる', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating="meh" onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-great');
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledWith('great');
      });
    });
  });

  describe('複数回の押下', () => {
    it('同じボタンを複数回押下できる', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const button = getByTestId('rating-button-great');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledTimes(3);
      });
      expect(mockOnRate).toHaveBeenCalledWith('great');
    });

    it('異なるボタンを連続して押下できる', async () => {
      const { getByTestId } = renderWithTheme(
        <RatingButtons selectedRating={null} onRate={mockOnRate} />
      );

      const mehButton = getByTestId('rating-button-meh');
      const goodButton = getByTestId('rating-button-good');
      const greatButton = getByTestId('rating-button-great');

      fireEvent.press(mehButton);
      fireEvent.press(goodButton);
      fireEvent.press(greatButton);

      await waitFor(() => {
        expect(mockOnRate).toHaveBeenCalledTimes(3);
      });
      expect(mockOnRate).toHaveBeenNthCalledWith(1, 'meh');
      expect(mockOnRate).toHaveBeenNthCalledWith(2, 'good');
      expect(mockOnRate).toHaveBeenNthCalledWith(3, 'great');
    });
  });
});
