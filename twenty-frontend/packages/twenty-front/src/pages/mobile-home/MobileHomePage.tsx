import React from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { IconLayoutDashboard } from 'twenty-ui/icon';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${themeCssVariables.background.primary};
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
  max-width: 500px;
`;

const IconWrapper = styled.div`
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

const Title = styled.h1`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${themeCssVariables.font.color.secondary};
  line-height: 1.5;
`;

export const MobileHomePage = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <PageWrapper>
        <ContentContainer>
          <IconWrapper>
            <IconLayoutDashboard />
          </IconWrapper>
          <Title>Dashboard - Under Construction</Title>
          <Subtitle>We're actively building a powerful new dashboard experience. Please check back later.</Subtitle>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};
