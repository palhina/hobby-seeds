/**
 * HurdleIndicator テスト
 *
 * ハードル表示（時間・コスト・場所）の表示ロジックをテスト
 */

import React from 'react';

import { HurdleIndicator } from '../HurdleIndicator';
import { renderWithTheme } from '../../__tests__/test-helpers';

describe('HurdleIndicator', () => {
  describe('時間表示', () => {
    it('時間が正しく表示される（5分）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      expect(getByText(/5分/)).toBeTruthy();
    });

    it('時間が正しく表示される（15分）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={15} cost={100} location="外" />
      );

      expect(getByText(/15分/)).toBeTruthy();
    });

    it('時間が正しく表示される（60分）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={60} cost={500} location="どこでも" />
      );

      expect(getByText(/60分/)).toBeTruthy();
    });
  });

  describe('コスト表示', () => {
    it('コスト0円の場合「0円」と表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      expect(getByText(/0円/)).toBeTruthy();
    });

    it('コストが100円の場合「100円」と表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={10} cost={100} location="外" />
      );

      expect(getByText(/100円/)).toBeTruthy();
    });

    it('コストが1000円の場合「1000円」と表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={30} cost={1000} location="外" />
      );

      expect(getByText(/1000円/)).toBeTruthy();
    });

    it('コストが500円の場合「500円」と表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={20} cost={500} location="どこでも" />
      );

      expect(getByText(/500円/)).toBeTruthy();
    });
  });

  describe('場所表示', () => {
    it('場所が「家」の場合、🏠アイコンと「家」が表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      // アイコンとテキストが同じ要素に含まれる
      expect(getByText(/🏠/)).toBeTruthy();
      expect(getByText(/家/)).toBeTruthy();
    });

    it('場所が「外」の場合、🚶アイコンと「外」が表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={15} cost={0} location="外" />
      );

      expect(getByText(/🚶/)).toBeTruthy();
      expect(getByText(/外/)).toBeTruthy();
    });

    it('場所が「どこでも」の場合、🚶アイコンと「どこでも」が表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={10} cost={0} location="どこでも" />
      );

      expect(getByText(/🚶/)).toBeTruthy();
      expect(getByText(/どこでも/)).toBeTruthy();
    });
  });

  describe('複合パターン', () => {
    it('時間・コスト・場所が全て正しく表示される（家・無料）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      expect(getByText(/5分/)).toBeTruthy();
      expect(getByText(/0円/)).toBeTruthy();
      expect(getByText(/🏠/)).toBeTruthy();
      expect(getByText(/家/)).toBeTruthy();
    });

    it('時間・コスト・場所が全て正しく表示される（外・有料）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={30} cost={500} location="外" />
      );

      expect(getByText(/30分/)).toBeTruthy();
      expect(getByText(/500円/)).toBeTruthy();
      expect(getByText(/🚶/)).toBeTruthy();
      expect(getByText(/外/)).toBeTruthy();
    });

    it('時間・コスト・場所が全て正しく表示される（どこでも・無料）', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={10} cost={0} location="どこでも" />
      );

      expect(getByText(/10分/)).toBeTruthy();
      expect(getByText(/0円/)).toBeTruthy();
      expect(getByText(/🚶/)).toBeTruthy();
      expect(getByText(/どこでも/)).toBeTruthy();
    });
  });

  describe('絵文字表示', () => {
    it('時間の絵文字⏱️が表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      expect(getByText(/⏱️/)).toBeTruthy();
    });

    it('コストの絵文字💰が表示される', () => {
      const { getByText } = renderWithTheme(
        <HurdleIndicator time={5} cost={0} location="家" />
      );

      expect(getByText(/💰/)).toBeTruthy();
    });
  });
});
