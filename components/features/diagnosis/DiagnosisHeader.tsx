/**
 * 診断画面用ヘッダー
 *
 * 戻るボタンと閉じるボタンを表示する
 */

import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';

// ===================
// Types
// ===================

type DiagnosisHeaderProps = {
  /** 戻るボタンを表示するか（デフォルト: true） */
  showBackButton?: boolean;
  /** 戻るボタン押下時のカスタムハンドラ（指定がなければrouter.back()） */
  onBack?: () => void;
};

// ===================
// Styled Components
// ===================

const SContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const SButton = styled.Pressable`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const SPlaceholder = styled.View`
  width: 48px;
  height: 48px;
`;

// ===================
// Component
// ===================

export function DiagnosisHeader({
  showBackButton = true,
  onBack,
}: DiagnosisHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // タブのホーム画面に戻る
    router.replace('/(tabs)');
  };

  return (
    <SContainer style={{ paddingTop: insets.top + 8 }}>
      {showBackButton ? (
        <SButton onPress={handleBack}>
          <IconSymbol name="chevron.left" size={28} color={theme.colors.primary} />
        </SButton>
      ) : (
        <SPlaceholder />
      )}

      <SButton onPress={handleClose}>
        <IconSymbol name="xmark" size={28} color={theme.colors.primary} />
      </SButton>
    </SContainer>
  );
}
