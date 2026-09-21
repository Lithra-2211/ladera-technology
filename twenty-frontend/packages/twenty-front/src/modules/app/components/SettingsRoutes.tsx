import React from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { IconSettings } from 'twenty-ui/icon';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${themeCssVariables.background.primary};
  align-items: center;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
  max-width: 500px;
`;

export const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${themeCssVariables.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: ${themeCssVariables.font.color.tertiary};

  svg {
    width: 32px;
    height: 32px;
    stroke-width: 1.5;
  }
`;

export const Title = styled.h1`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${themeCssVariables.font.color.secondary};
  line-height: 1.5;
`;

type SettingsRoutesProps = {
  isAdminPageEnabled?: boolean;
};

export const SettingsRoutes = ({ isAdminPageEnabled }: SettingsRoutesProps) => {
  return (
    <>
      <PageTitle title="Administration" />
      <PageWrapper>
        <ContentContainer>
          <IconWrapper>
            <IconSettings />
          </IconWrapper>
          <Title>Administration - Under Construction</Title>
          <Subtitle>Administrative controls and workspace settings are currently being upgraded. Please check back later.</Subtitle>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};
