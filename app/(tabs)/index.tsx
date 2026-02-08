import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  SScreenContainer,
  SCenteredContent,
  SFooter,
  SAbsoluteHeader,
  SIconButton,
  SPrimaryButtonLarge,
  SPrimaryButtonLargeText,
  SDisplayText,
  SSubtitle,
  SMutedText,
  SEmojiLarge,
} from '@/components/ui/primitives';

// ===================
// Local Styles
// ===================

const SEmojiSpaced = styled(SEmojiLarge)`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const STitleSpaced = styled(SDisplayText)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SSubtitleSpaced = styled(SSubtitle)`
  margin-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

// ===================
// Component
// ===================

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleStartDiagnosis = () => {
    router.push('/diagnosis');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <SScreenContainer style={{ paddingTop: insets.top }}>
      <SAbsoluteHeader style={{ paddingTop: insets.top }}>
        <SIconButton onPress={handleOpenSettings}>
          <IconSymbol name="gearshape.fill" size={24} color="#4A3728" />
        </SIconButton>
      </SAbsoluteHeader>
      <SCenteredContent>
        <SEmojiSpaced>🌱</SEmojiSpaced>
        <STitleSpaced>趣味のたね</STitleSpaced>
        <SSubtitleSpaced>
          「何かしなきゃ」を{'\n'}
          「ちょっと試してみた」に変える
        </SSubtitleSpaced>
        <SPrimaryButtonLarge onPress={handleStartDiagnosis}>
          <SPrimaryButtonLargeText>今日の気分を診断する</SPrimaryButtonLargeText>
        </SPrimaryButtonLarge>
      </SCenteredContent>
      <SFooter style={{ paddingBottom: insets.bottom + 16 }}>
        <SMutedText style={{ textAlign: 'center' }}>
          続かなくても大丈夫。{'\n'}
          試すことに意味がある
        </SMutedText>
      </SFooter>
    </SScreenContainer>
  );
}
