import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SEmoji = styled.Text`
  font-size: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const STitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

const SStartButton = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-horizontal: ${({ theme }) => theme.spacing.xxl}px;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const SButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

const SFooter = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

const SFooterText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleStartDiagnosis = () => {
    router.push('/diagnosis');
  };

  return (
    <SContainer style={{ paddingTop: insets.top }}>
      <SContent>
        <SEmoji>🌱</SEmoji>
        <STitle>趣味のたね</STitle>
        <SSubtitle>
          「何かしなきゃ」を{'\n'}
          「ちょっと試してみた」に変える
        </SSubtitle>
        <SStartButton onPress={handleStartDiagnosis}>
          <SButtonText>今日の気分を診断する</SButtonText>
        </SStartButton>
      </SContent>
      <SFooter style={{ paddingBottom: insets.bottom + 16 }}>
        <SFooterText>
          続かなくても大丈夫。{'\n'}
          試すことに意味がある
        </SFooterText>
      </SFooter>
    </SContainer>
  );
}
