/**
 * 利用規約画面
 *
 * アプリの利用規約を表示
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';

const SContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const SHeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SCloseButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const SContent = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const SSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SSectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SListItem = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding-left: ${({ theme }) => theme.spacing.md}px;
`;

const SUpdatedDate = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  return (
    <SContainer style={{ paddingTop: insets.top }}>
      <SHeader>
        <SHeaderTitle>利用規約</SHeaderTitle>
        <SCloseButton onPress={handleClose}>
          <IconSymbol name="xmark" size={24} color="#4A3728" />
        </SCloseButton>
      </SHeader>

      <ScrollView>
        <SContent>
          <SSection>
            <SSectionTitle>第1条（適用）</SSectionTitle>
            <SText>
              本規約は、本アプリ「趣味のたね」（以下「本アプリ」といいます）の利用に関する条件を、本アプリを利用するすべてのユーザーと本アプリ提供者との間で定めるものです。
            </SText>
            <SText>
              ユーザーは、本アプリを利用することにより、本規約に同意したものとみなされます。
            </SText>
          </SSection>

          <SSection>
            <SSectionTitle>第2条（本アプリの内容）</SSectionTitle>
            <SText>
              本アプリは、ユーザーの気分に合わせた趣味を提案するサービスです。
            </SText>
            <SText>
              本アプリは無料で提供され、すべてのデータは端末内にのみ保存されます。外部サーバーへのデータ送信は一切行いません。
            </SText>
          </SSection>

          <SSection>
            <SSectionTitle>第3条（禁止事項）</SSectionTitle>
            <SText>ユーザーは、本アプリの利用にあたり、以下の行為を行ってはならないものとします。</SText>
            <SListItem>• 本アプリの運営を妨害する行為</SListItem>
            <SListItem>• 本アプリを不正な目的で使用する行為</SListItem>
            <SListItem>• リバースエンジニアリング、逆コンパイル、逆アセンブル等の行為</SListItem>
            <SListItem>• その他、本アプリ提供者が不適切と判断する行為</SListItem>
          </SSection>

          <SSection>
            <SSectionTitle>第4条（免責事項）</SSectionTitle>
            <SText>
              本アプリは「現状有姿」で提供されるものであり、本アプリ提供者は、本アプリの正確性、完全性、有用性等について、いかなる保証も行いません。
            </SText>
            <SText>
              本アプリの利用により生じた損害について、本アプリ提供者は一切の責任を負いません。
            </SText>
          </SSection>

          <SSection>
            <SSectionTitle>第5条（本アプリの変更・終了）</SSectionTitle>
            <SText>
              本アプリ提供者は、ユーザーへの事前の通知なく、本アプリの内容を変更、または本アプリの提供を終了することができるものとします。
            </SText>
          </SSection>

          <SSection>
            <SSectionTitle>第6条（規約の変更）</SSectionTitle>
            <SText>
              本アプリ提供者は、必要に応じて本規約を変更することができるものとします。変更後の規約は、本アプリ内で表示した時点より効力を生じるものとします。
            </SText>
          </SSection>

          <SSection>
            <SSectionTitle>第7条（準拠法・管轄裁判所）</SSectionTitle>
            <SText>
              本規約の解釈にあたっては、日本法を準拠法とします。
            </SText>
            <SText>
              本アプリに関して紛争が生じた場合には、本アプリ提供者の所在地を管轄する裁判所を専属的合意管轄とします。
            </SText>
          </SSection>

          <SUpdatedDate>最終更新日: 2026年2月5日</SUpdatedDate>
        </SContent>
      </ScrollView>
    </SContainer>
  );
}
