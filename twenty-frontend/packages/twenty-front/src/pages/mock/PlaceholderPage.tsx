import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 16px;
`;

export const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <>
      <PageTitle title={title} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Container>
          {title} - Under Construction
        </Container>
      </div>
    </>
  );
};
