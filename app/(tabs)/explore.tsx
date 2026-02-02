/**
 * 探索画面
 *
 * 趣味をカテゴリ別・タグ別で探せる画面
 */

import React, { useState, useMemo } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HobbyCard } from '@/components/features/hobby/HobbyCard';
import hobbiesData from '@/data/hobbies.json';

import type { YuruHobby, Category } from '@/types';

// ===================
// Constants
// ===================

const EXPLORE_CATEGORIES: { value: Category | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'すべて', emoji: '🌈' },
  { value: '眺める', label: '眺める', emoji: '👀' },
  { value: '聴く', label: '聴く', emoji: '🎧' },
  { value: '作る', label: '作る', emoji: '✨' },
  { value: '動く', label: '動く', emoji: '🏃' },
  { value: '学ぶ', label: '学ぶ', emoji: '📚' },
  { value: '整える', label: '整える', emoji: '🧹' },
  { value: '遊ぶ', label: '遊ぶ', emoji: '🎮' },
];

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SHeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const SCategoryScroll = styled(ScrollView)`
  max-height: 40px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SCategoryButton = styled.Pressable<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const SCategoryEmoji = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const SCategoryLabel = styled.Text<{ selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ selected }) => (selected ? '#FFFFFF' : '#4A3728')};
`;

const SListContainer = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

const SResultCount = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SEmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxl}px;
`;

const SEmptyEmoji = styled.Text`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SEmptyText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

// ===================
// Component
// ===================

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // カテゴリでフィルタリング
  const filteredHobbies = useMemo(() => {
    const hobbies = hobbiesData as YuruHobby[];
    if (selectedCategory === 'all') {
      return hobbies;
    }
    return hobbies.filter((hobby) => hobby.category === selectedCategory);
  }, [selectedCategory]);

  const handleHobbyPress = (id: number) => {
    router.push(`/results/${id}`);
  };

  const renderHobbyItem = ({ item }: { item: YuruHobby }) => (
    <HobbyCard hobby={item} onPress={handleHobbyPress} />
  );

  return (
    <SContainer style={{ paddingTop: insets.top }}>
      <SHeader>
        <SHeaderTitle>🔍 趣味をさがす</SHeaderTitle>
        <SHeaderSubtitle>カテゴリから気になる趣味を見つけよう</SHeaderSubtitle>
      </SHeader>

      {/* カテゴリフィルター */}
      <SCategoryScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {EXPLORE_CATEGORIES.map((category) => (
          <SCategoryButton
            key={category.value}
            selected={selectedCategory === category.value}
            onPress={() => setSelectedCategory(category.value)}
          >
            <SCategoryEmoji>{category.emoji}</SCategoryEmoji>
            <SCategoryLabel selected={selectedCategory === category.value}>
              {category.label}
            </SCategoryLabel>
          </SCategoryButton>
        ))}
      </SCategoryScroll>

      {/* 趣味一覧 */}
      <SListContainer>
        <SResultCount>
          {filteredHobbies.length}件の趣味
        </SResultCount>

        {filteredHobbies.length > 0 ? (
          <FlatList
            data={filteredHobbies}
            renderItem={renderHobbyItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <SEmptyContainer>
            <SEmptyEmoji>🤔</SEmptyEmoji>
            <SEmptyText>このカテゴリには趣味がありません</SEmptyText>
          </SEmptyContainer>
        )}
      </SListContainer>
    </SContainer>
  );
}
