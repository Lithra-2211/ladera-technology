import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCustomerData, CustomerRecord } from './context/CustomerDataContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px 16px;
  width: 100%;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  background: white;
  box-sizing: border-box;
`;

const TitleSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const AvatarSquare = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: ${({ color }) => color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
`;

const TitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  gap: 12px;
`;

const Tag = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type }) => (type === 'Active' ? '#dcfce7' : type === 'At risk' ? '#ffedd5' : '#f3f4f6')};
  color: ${({ type }) => (type === 'Active' ? '#166534' : type === 'At risk' ? '#9a3412' : '#4b5563')};
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${themeCssVariables.border.color.medium};
  background-color: white;
  color: ${themeCssVariables.font.color.primary};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  background-color: #fafafa;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 24px 32px;
`;

const MetricCard = styled.div`
  background: white;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding: 0 32px;
  background: white;
  box-sizing: border-box;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ active }) => (active ? themeCssVariables.color.blue : themeCssVariables.font.color.secondary)};
  border-bottom: 2px solid ${({ active }) => (active ? themeCssVariables.color.blue : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${themeCssVariables.color.blue};
  }
`;

const TabContent = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionCard = styled.div`
  background: white;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
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
`;

const KeyValueList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const KvPair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const KvKey = styled.div`
  font-size: 11px;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const KvValue = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.primary};
  font-weight: 500;
`;

export const Customer360Page = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, getOrdersForCustomer, getTicketsForCustomer } = useCustomerData();

  const [activeTab, setActiveTab] = useState('Overview');

  const customer = customers.find(c => c.id === id);
  const orders = customer ? getOrdersForCustomer(customer.id) : [];
  const tickets = customer ? getTicketsForCustomer(customer.id) : [];

  if (!customer) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h2>Customer not found</h2>
        <Button onClick={() => navigate('/objects/companies')}>Back to Customers</Button>
      </div>
    );
  }

  // Calculate metrics
  const totalOrdersCount = orders.length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const closedTicketsCount = tickets.filter(t => t.status === 'Closed').length;

  const tabs = ['Overview', 'Orders History', 'Complaint/Ticket History', 'Feedback & CSAT', 'Communication Timeline', 'Follow-Up Activities', 'Warranty Records', 'Spare Requests', 'Replacement Records'];

  return (
    <>
      <PageTitle title={`${customer.name} - 360 View`} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        <PageHeader>
          <TitleSection>
            <AvatarSquare color={customer.color}>{customer.initials}</AvatarSquare>
            <TitleInfo>
              <Title>
                {customer.name}
                <Tag type="Segment">{customer.type}</Tag>
                <Tag type={customer.health}>{customer.health}</Tag>
              </Title>
              <Subtitle>
                <span>{customer.mobile}</span>
                <span>•</span>
                <span>{customer.email || 'No email provided'}</span>
                <span>•</span>
                <span>{customer.city}, {customer.state}</span>
              </Subtitle>
            </TitleInfo>
          </TitleSection>
          <Button onClick={() => navigate('/objects/companies')}>Back</Button>
        </PageHeader>

        <MainContent>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Total Orders</MetricLabel>
              <MetricValue>{totalOrdersCount}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Lifetime Value</MetricLabel>
              <MetricValue>{customer.ltv}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Open Tickets</MetricLabel>
              <MetricValue style={{ color: openTicketsCount > 0 ? '#ef4444' : 'inherit' }}>{openTicketsCount}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Closed Tickets</MetricLabel>
              <MetricValue>{closedTicketsCount}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Avg CSAT</MetricLabel>
              <MetricValue>{customer.avgCsat}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Last Interaction</MetricLabel>
              <MetricValue style={{ fontSize: '16px', marginTop: '4px' }}>{customer.lastInteractionDate}</MetricValue>
            </MetricCard>
          </MetricsGrid>

          <TabsContainer>
            {tabs.map(tab => (
              <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </Tab>
            ))}
          </TabsContainer>

          <TabContent>
            {activeTab === 'Overview' && (
              <SectionCard>
                <SectionTitle>Customer Profile Details</SectionTitle>
                <KeyValueList>
                  <KvPair><KvKey>Customer Type</KvKey><KvValue>{customer.type}</KvValue></KvPair>
                  <KvPair><KvKey>Segment</KvKey><KvValue>{customer.segment}</KvValue></KvPair>
                  <KvPair><KvKey>Source</KvKey><KvValue>{customer.source}</KvValue></KvPair>
                  <KvPair><KvKey>Region</KvKey><KvValue>{customer.region}</KvValue></KvPair>
                  <KvPair><KvKey>Business Potential</KvKey><KvValue>{customer.potential}</KvValue></KvPair>
                  <KvPair><KvKey>Dealer/Distributor Code</KvKey><KvValue>{customer.dealerCode || 'N/A'}</KvValue></KvPair>
                  <KvPair><KvKey>Address</KvKey><KvValue>{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</KvValue></KvPair>
                  <KvPair><KvKey>Notes</KvKey><KvValue>{customer.notes || 'None'}</KvValue></KvPair>
                </KeyValueList>
              </SectionCard>
            )}

            {activeTab === 'Orders History' && (
              <SectionCard>
                <SectionTitle>Recent Orders</SectionTitle>
                {orders.length > 0 ? (
                  <Table>
                    <thead><tr><Th>Date</Th><Th>Amount</Th><Th>Status</Th></tr></thead>
                    <tbody>
                      {orders.map(o => <tr key={o.id}><Td>{o.date}</Td><Td>{o.amount}</Td><Td>{o.status}</Td></tr>)}
                    </tbody>
                  </Table>
                ) : (
                  <div style={{ color: themeCssVariables.font.color.tertiary, fontSize: '13px' }}>No orders found.</div>
                )}
              </SectionCard>
            )}

            {activeTab === 'Complaint/Ticket History' && (
              <SectionCard>
                <SectionTitle>Service Tickets</SectionTitle>
                {tickets.length > 0 ? (
                  <Table>
                    <thead><tr><Th>Date</Th><Th>Subject</Th><Th>Status</Th></tr></thead>
                    <tbody>
                      {tickets.map(t => <tr key={t.id}><Td>{t.date}</Td><Td>{t.subject}</Td><Td>{t.status}</Td></tr>)}
                    </tbody>
                  </Table>
                ) : (
                  <div style={{ color: themeCssVariables.font.color.tertiary, fontSize: '13px' }}>No tickets found.</div>
                )}
              </SectionCard>
            )}

            {['Feedback & CSAT', 'Communication Timeline', 'Follow-Up Activities', 'Warranty Records', 'Spare Requests', 'Replacement Records'].includes(activeTab) && (
              <SectionCard>
                <SectionTitle>{activeTab}</SectionTitle>
                <div style={{ color: themeCssVariables.font.color.tertiary, fontSize: '13px', padding: '32px 0', textAlign: 'center' }}>
                  No records available for this section.
                </div>
              </SectionCard>
            )}
          </TabContent>
        </MainContent>
      </div>
    </>
  );
};
