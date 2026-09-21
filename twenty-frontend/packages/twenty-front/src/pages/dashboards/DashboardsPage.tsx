import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { ResponsivePie } from '@nivo/pie';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px 16px;
  width: 100%;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ primary }) => primary ? 'transparent' : themeCssVariables.border.color.medium};
  background-color: ${({ primary }) => primary ? themeCssVariables.color.red50 : 'transparent'};
  color: ${({ primary }) => primary ? 'white' : themeCssVariables.font.color.primary};
  box-shadow: ${({ primary }) => primary ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
  padding: 0 32px 32px;
  flex: 1;
  overflow-y: auto;
`;

const Card = styled.div`
  background: ${themeCssVariables.background.primary};
  border-radius: 12px;
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
`;

const CardTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 200px;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  padding-bottom: 12px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const Td = styled.td`
  padding: 12px 0;
  font-size: 13px;
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};

  &:first-child {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const TrendBadge = styled.span<{ trend: 'rising' | 'falling' | 'flat' }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ trend }) => 
    trend === 'rising' ? themeCssVariables.color.red50 : 
    trend === 'falling' ? themeCssVariables.color.green50 : 
    themeCssVariables.font.color.tertiary};
  
  &::before {
    content: '${({ trend }) => trend === 'rising' ? '▲ ' : trend === 'falling' ? '▼ ' : '— '}';
  }
`;

// Custom Bar Chart Components
const BarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: flex-end;
`;

const BarsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
  padding-bottom: 8px;
`;

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const BarLabelTop = styled.div`
  font-size: 12px;
  color: ${themeCssVariables.font.color.secondary};
  font-weight: 600;
`;

const BarTrack = styled.div`
  width: 40px;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 4px;
  height: 100%;
`;

const BarFill = styled.div<{ color: string, heightPercent: number }>`
  width: 100%;
  border-radius: 4px;
  background: ${({ color }) => color};
  height: ${({ heightPercent }) => heightPercent}%;
  transition: height 0.3s ease;
`;

const BarAxisBottom = styled.div`
  font-size: 12px;
  color: ${themeCssVariables.font.color.tertiary};
`;

export const ReportsPage = () => {
  const ticketsData = [
    { day: 'Mon', tickets: 62 },
    { day: 'Tue', tickets: 74 },
    { day: 'Wed', tickets: 58 },
    { day: 'Thu', tickets: 95 },
    { day: 'Fri', tickets: 81 },
    { day: 'Sat', tickets: 102 },
    { day: 'Sun', tickets: 110 } // Estimated from graph
  ];

  const slaData = [
    { id: 'Met', value: 64, color: '#0ea5e9' },
    { id: 'Recovered', value: 22, color: '#f59e0b' },
    { id: 'Breached', value: 14, color: '#ef4444' }
  ];

  const leadData = [
    { source: 'Website', conversion: 34 },
    { source: 'WhatsApp', conversion: 28 },
    { source: 'Phone', conversion: 19 },
    { source: 'Social', conversion: 12 },
    { source: 'Walk-in', conversion: 9 }
  ];

  const topIssues = [
    { cause: 'Damaged in transit', tickets: 31, trend: 'rising' as const },
    { cause: 'Assembly hardware missing', tickets: 18, trend: 'falling' as const },
    { cause: 'Recliner mechanism defect', tickets: 12, trend: 'flat' as const },
    { cause: 'Invoice mismatch', tickets: 7, trend: 'falling' as const },
  ];

  return (
    <>
      <PageTitle title="Reports" />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        <PageHeader>
          <TitleSection>
            <Title>Reports</Title>
            <Subtitle>Live dashboards on a dedicated analytics store — exports in one click</Subtitle>
          </TitleSection>
          <ActionsSection>
            <Button primary>+ New report</Button>
            <Button>Schedule email</Button>
            <Button>Export</Button>
          </ActionsSection>
        </PageHeader>
        
        <Grid>
          <Card>
            <CardTitle>Tickets created · last 7 days</CardTitle>
            <ChartContainer>
              <BarChartContainer>
                <BarsWrapper>
                  {ticketsData.map((d, i) => {
                    const max = 110;
                    const heightPercent = (d.tickets / max) * 100;
                    return (
                      <BarColumn key={i}>
                        <BarLabelTop>{d.tickets}</BarLabelTop>
                        <BarTrack>
                          <BarFill color="#f87171" heightPercent={heightPercent} />
                        </BarTrack>
                        <BarAxisBottom>{d.day}</BarAxisBottom>
                      </BarColumn>
                    );
                  })}
                </BarsWrapper>
              </BarChartContainer>
            </ChartContainer>
          </Card>

          <Card>
            <CardTitle>SLA outcomes · this month</CardTitle>
            <ChartContainer style={{ display: 'flex' }}>
              <ResponsivePie
                data={slaData}
                margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={2}
                cornerRadius={3}
                colors={{ datum: 'data.color' }}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 10,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#4b5563',
                    symbolSize: 12,
                    symbolShape: 'square'
                  }
                ]}
              />
            </ChartContainer>
          </Card>

          <Card>
            <CardTitle>Lead conversion by source · 30 days</CardTitle>
            <ChartContainer>
              <BarChartContainer>
                <BarsWrapper>
                  {leadData.map((d, i) => {
                    const max = 40;
                    const heightPercent = (d.conversion / max) * 100;
                    return (
                      <BarColumn key={i}>
                        <BarLabelTop>{d.conversion}%</BarLabelTop>
                        <BarTrack>
                          <BarFill color="#5eead4" heightPercent={heightPercent} />
                        </BarTrack>
                        <BarAxisBottom>{d.source}</BarAxisBottom>
                      </BarColumn>
                    );
                  })}
                </BarsWrapper>
              </BarChartContainer>
            </ChartContainer>
          </Card>

          <Card>
            <CardTitle>Top issue causes</CardTitle>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>CAUSE</Th>
                    <Th>TICKETS</Th>
                    <Th>TREND</Th>
                  </tr>
                </thead>
                <tbody>
                  {topIssues.map((issue, i) => (
                    <tr key={i}>
                      <Td>{issue.cause}</Td>
                      <Td>{issue.tickets}</Td>
                      <Td><TrendBadge trend={issue.trend}>{issue.trend}</TrendBadge></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </div>
    </>
  );
};
