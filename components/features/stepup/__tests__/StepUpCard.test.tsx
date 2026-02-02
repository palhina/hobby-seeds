/**
 * StepUpCard テスト
 *
 * ステップアップカードの表示とインタラクションをテスト
 */

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { StepUpCard } from '../StepUpCard';
import { renderWithTheme } from '../../__tests__/test-helpers';

import type { StepUpHobby, Tag } from '@/types';

describe('StepUpCard', () => {
  const mockHobby: StepUpHobby = {
    id: 101,
    name: 'デジタルイラスト',
    emoji: '🎨',
    tags: ['クリエイティブ', 'アート', '手作業'],
    matchTags: ['クリエイティブ', 'アート'],
    description: 'タブレットやPCで絵を描く趣味。無料アプリも充実',
    startCost: '0円〜',
    startGuide: 'まずは無料アプリ「ibisPaint」から',
    timeCommit: '週2〜3時間',
    nextSteps: [
      'ibisPaintをダウンロード',
      'YouTubeで検索',
      '好きな絵師をフォロー',
    ],
  };

  const matchedTags: Tag[] = ['クリエイティブ', 'アート'];
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('基本表示', () => {
    it('趣味名が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('デジタルイラスト')).toBeTruthy();
    });

    it('絵文字が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('🎨')).toBeTruthy();
    });

    it('説明文が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText(/タブレットやPCで絵を描く/)).toBeTruthy();
    });

    it('マッチ度が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('マッチ度 85%')).toBeTruthy();
    });

    it('初期コストが表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('初期コスト')).toBeTruthy();
      expect(getByText('0円〜')).toBeTruthy();
    });

    it('かかる時間が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('かかる時間')).toBeTruthy();
      expect(getByText('週2〜3時間')).toBeTruthy();
    });
  });

  describe('タグ表示', () => {
    it('マッチしたタグが表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('#クリエイティブ')).toBeTruthy();
      expect(getByText('#アート')).toBeTruthy();
    });

    it('タグが1つの場合も正しく表示される', () => {
      const singleTag: Tag[] = ['クリエイティブ'];
      const { getByText, queryByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={singleTag}
          onPress={mockOnPress}
        />
      );

      expect(getByText('#クリエイティブ')).toBeTruthy();
      expect(queryByText('#アート')).toBeNull();
    });

    it('タグが3つの場合も正しく表示される', () => {
      const threeTags: Tag[] = ['クリエイティブ', 'アート', '手作業'];
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={threeTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('#クリエイティブ')).toBeTruthy();
      expect(getByText('#アート')).toBeTruthy();
      expect(getByText('#手作業')).toBeTruthy();
    });

    it('タグが0の場合、タグコンテナが空でもエラーにならない', () => {
      const { queryByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={[]}
          onPress={mockOnPress}
        />
      );

      // タグがなくてもレンダリングはできる
      expect(queryByText('#クリエイティブ')).toBeNull();
    });
  });

  describe('マッチ度のパターン', () => {
    it('マッチ度100%が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={100}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('マッチ度 100%')).toBeTruthy();
    });

    it('マッチ度50%が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={50}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      expect(getByText('マッチ度 50%')).toBeTruthy();
    });

    it('マッチ度0%が表示される', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={0}
          matchedTags={[]}
          onPress={mockOnPress}
        />
      );

      expect(getByText('マッチ度 0%')).toBeTruthy();
    });
  });

  describe('インタラクション', () => {
    it('カード押下でonPressが趣味IDと共に呼ばれる', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      const card = getByText('デジタルイラスト');
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledWith(101);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('カードを複数回押下できる', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      const card = getByText('デジタルイラスト');
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
      expect(mockOnPress).toHaveBeenCalledWith(101);
    });

    it('異なる箇所（説明文）を押下してもonPressが呼ばれる', () => {
      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={mockHobby}
          matchScore={85}
          matchedTags={matchedTags}
          onPress={mockOnPress}
        />
      );

      const description = getByText(/タブレットやPCで絵を描く/);
      fireEvent.press(description);

      expect(mockOnPress).toHaveBeenCalledWith(101);
    });
  });

  describe('異なる趣味データ', () => {
    it('ヨガの趣味が正しく表示される', () => {
      const yogaHobby: StepUpHobby = {
        id: 102,
        name: 'ヨガ',
        emoji: '🧘‍♀️',
        tags: ['フィジカル', 'リラックス', '健康'],
        matchTags: ['フィジカル', 'リラックス'],
        description: '心と体を整える、自分のペースでできる運動',
        startCost: '0円〜',
        startGuide: 'YouTubeの「朝ヨガ10分」から',
        timeCommit: '週2〜3回',
        nextSteps: ['YouTubeを見る', 'ヨガマット購入', 'スタジオ体験'],
      };

      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={yogaHobby}
          matchScore={90}
          matchedTags={['フィジカル', 'リラックス']}
          onPress={mockOnPress}
        />
      );

      expect(getByText('ヨガ')).toBeTruthy();
      expect(getByText('🧘‍♀️')).toBeTruthy();
      expect(getByText(/心と体を整える/)).toBeTruthy();
      expect(getByText('マッチ度 90%')).toBeTruthy();
      expect(getByText('#フィジカル')).toBeTruthy();
      expect(getByText('#リラックス')).toBeTruthy();
    });

    it('ランニングの趣味が正しく表示される', () => {
      const runningHobby: StepUpHobby = {
        id: 103,
        name: 'ランニング',
        emoji: '🏃',
        tags: ['フィジカル', '健康', '散歩'],
        matchTags: ['フィジカル', '健康'],
        description: '散歩の延長から始める運動習慣',
        startCost: '5,000円〜',
        startGuide: '最初は歩き混じりでOK',
        timeCommit: '週2〜3回',
        nextSteps: ['シューズ購入', 'アプリ導入', 'コース決め'],
      };

      const { getByText } = renderWithTheme(
        <StepUpCard
          hobby={runningHobby}
          matchScore={75}
          matchedTags={['フィジカル', '健康']}
          onPress={mockOnPress}
        />
      );

      expect(getByText('ランニング')).toBeTruthy();
      expect(getByText('5,000円〜')).toBeTruthy();
      expect(getByText('週2〜3回')).toBeTruthy();
    });
  });
});
