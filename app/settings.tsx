/**
 * 設定画面
 *
 * プライバシーポリシー、利用規約などの情報リンクを表示
 */

import React from 'react';
import { Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  SScreenContainer,
  SContent,
  SRowBetween,
  STitle,
  SSmallText,
  SMutedText,
} from '@/components/ui/primitives';

// ===================
// Local Styles
// ===================

const SHeader = styled(SRowBetween)`
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const SHeaderTitle = styled(STitle)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
`;

const SCloseButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const SSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SSectionTitle = styled(STitle)`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SLinkButton = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SLinkText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const SDescription = styled(SSmallText)`
  line-height: 20px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SAppInfo = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const SAppName = styled(STitle)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const SVersion = styled(SMutedText)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

// TODO: GitHub PagesのURLが決まったらここを更新してください
const PRIVACY_POLICY_URL = 'https://your-github-username.github.io/hobby-seeds/privacy';

// ===================
// Component
// ===================

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  const handleOpenPrivacyPolicy = async () => {
    try {
      const canOpen = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (canOpen) {
        await Linking.openURL(PRIVACY_POLICY_URL);
      } else {
        Alert.alert('エラー', 'プライバシーポリシーを開けませんでした。');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to open privacy policy:', error);
      }
      Alert.alert('エラー', 'プライバシーポリシーを開けませんでした。');
    }
  };

  const handleOpenTerms = () => {
    router.push('/terms');
  };

  return (
    <SScreenContainer style={{ paddingTop: insets.top }}>
      <SHeader>
        <SHeaderTitle>設定</SHeaderTitle>
        <SCloseButton onPress={handleClose}>
          <IconSymbol name="xmark" size={24} color="#4A3728" />
        </SCloseButton>
      </SHeader>

      <SContent>
        <SSection>
          <SSectionTitle>法的情報</SSectionTitle>
          <SDescription>
            このアプリは完全にローカルで動作します。{'\n'}
            すべてのデータは端末内にのみ保存され、外部サーバーに送信されることはありません。
          </SDescription>

          <SLinkButton onPress={handleOpenPrivacyPolicy}>
            <SLinkText>プライバシーポリシー</SLinkText>
          </SLinkButton>

          <SLinkButton onPress={handleOpenTerms}>
            <SLinkText>利用規約</SLinkText>
          </SLinkButton>
        </SSection>

        <SAppInfo>
          <SAppName>🌱 趣味のたね</SAppName>
          <SVersion>Version 1.0.0</SVersion>
        </SAppInfo>
      </SContent>
    </SScreenContainer>
  );
}
