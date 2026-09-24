import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { useCustomerData, CustomerRecord } from './context/CustomerDataContext';
import { 
  IconPencil, IconTicket, IconCalendarEvent, IconNote, IconPhone, IconMail, 
  IconMapPin, IconId, IconCircleCheckFilled, IconCircleXFilled, IconArrowLeft,
  IconShoppingCart, IconChecklist, IconStar, IconCurrencyRupee, IconClock,
  IconBuildingStore, IconUser, IconMessageDots, IconFiles, 
  IconReceipt, IconBriefcase, IconTarget, IconArrowUpRight, IconArrowDownRight, IconMinus
} from '@tabler/icons-react';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #F8FAFC;
  overflow-y: auto;
  box-sizing: border-box;
  color: #0F172A;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const HeroHeader = styled.div`
  margin: 16px 16px 0 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
  border-radius: 16px;
  border: 1px solid #BFDBFE;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.08);
  position: relative;
  transition: all 0.25s ease;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const HeroTitleSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const HeroAvatar = styled.div<{ bg?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60A5FA, #2563EB);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  border: 2px solid #FFFFFF;
  flex-shrink: 0;
`;

const HeroTitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeroTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1D4ED8;
  line-height: 1.1;
`;

const Badge = styled.span<{ variant?: 'customer' | 'active' | 'inactive' | 'neutral' }>`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  
  ${({ variant }) => {
    switch (variant) {
      case 'customer': return 'background: #DBEAFE; color: #2563EB; border: none;';
      case 'active': return 'background: #DCFCE7; color: #16A34A; border: none;';
      case 'inactive': return 'background: #FEE2E2; color: #EF4444; border: none;';
      default: return 'background: #F1F5F9; color: #475569; border: none;';
    }
  }}
`;

const HeroSubtitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 2px;
`;

const HeroIconText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  svg {
    color: #2563EB;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  font-family: inherit;
  border: none;
  background: #2563EB;
  color: #FFFFFF;

  &:hover {
    background: #1D4ED8;
    color: #FFFFFF;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    background: #1E40AF;
    color: #FFFFFF;
    transform: translateY(0);
    box-shadow: none;
  }
`;

const MainContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const KpiCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px -4px rgba(37, 99, 235, 0.15);
    border-color: #2563EB;
  }
`;

const KpiHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const KpiIconWrapper = styled.div<{ colorBg: string, colorText: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ colorBg }) => colorBg};
  color: ${({ colorText }) => colorText};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 250ms ease;
`;

const KpiLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KpiValueRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const KpiValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1;
`;

const EmptyKpiValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #94A3B8;
  line-height: 1.2;
`;

const KpiTrend = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

const TrendIndicator = styled.span<{ trend?: 'up' | 'down' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  ${({ trend }) => {
    switch (trend) {
      case 'up': return 'color: #10B981;';
      case 'down': return 'color: #F59E0B;';
      default: return 'color: #94A3B8;';
    }
  }}
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  background: transparent;
  padding: 4px 8px;
  overflow-x: auto;
  border-bottom: 1px solid #E2E8F0;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  background: ${({ active }) => (active ? '#2563EB' : 'transparent')};
  color: ${({ active }) => (active ? '#FFFFFF' : '#64748B')};
  font-size: 13px;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  height: 32px;
  font-family: inherit;

  &:hover {
    color: ${({ active }) => (active ? '#FFFFFF' : '#2563EB')};
    background: ${({ active }) => (active ? '#1D4ED8' : '#DBEAFE')};
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div<{ hoverBorderColor?: string }>`
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
    border-color: ${({ hoverBorderColor }) => hoverBorderColor || '#BFDBFE'};
  }
`;

const SectionTitle = styled.h3<{ bg?: string; textColor?: string }>`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${({ textColor }) => textColor || '#0F172A'};
  background: ${({ bg }) => bg || 'transparent'};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ bg }) => (bg ? '12px 16px' : '0')};
  border-bottom: ${({ bg }) => (bg ? '1px solid #E2E8F0' : 'none')};
`;

const SectionBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KvList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px 12px;
`;

const KvPair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const KvKey = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
`;

const KvValue = styled.div`
  font-size: 16px;
  color: #0F172A;
  font-weight: 600;
  word-break: break-word;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const AddressCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
    border-color: #FDBA74;
  }
`;

const AddressTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
`;

const AddressText = styled.div`
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  color: #64748B;
  font-weight: 500;
  font-size: 12px;
`;

const Td = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid #F1F5F9;
  color: #1E293B;
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #64748B;
  text-align: center;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px dashed #CBD5E1;
`;

// WIDGET STYLES
const WidgetContainer = styled(SectionCard)`
  gap: 0;
`;

const WidgetHeader = styled.div<{ bg: string; color: string }>`
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #E2E8F0;
`;

const WidgetBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const WidgetEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px 0;
`;

const WidgetEmptyIconContainer = styled.div<{ bg: string; color: string }>`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const WidgetEmptyTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
`;

const WidgetEmptyDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #94A3B8;
  max-width: 200px;
  line-height: 1.4;
`;

const WidgetItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const WidgetIconBox = styled.div<{ bg: string, color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WidgetContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WidgetTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const WidgetTitle = styled.div`
  font-weight: 600;
  color: #0F172A;
  font-size: 13px;
`;

const WidgetDesc = styled.div`
  font-size: 12px;
  color: #64748B;
`;



// TIMELINE STYLES
const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 20px;
  gap: 20px;
  margin-top: 8px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 6px;
    bottom: 6px;
    width: 2px;
    background: #E2E8F0;
  }
`;

const TimelineItem = styled.div`
  position: relative;
`;

const TimelineDot = styled.div<{ color: string }>`
  position: absolute;
  left: -20px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ color }) => color};
  border: 2px solid white;
  box-shadow: 0 0 0 1px #E2E8F0;
`;

const TimelineContent = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 14px;
  margin-left: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: #0F172A;
  font-size: 13px;
`;

const TimelineDate = styled.div`
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
`;

const TimelineDesc = styled.div`
  font-size: 12px;
  color: #334155;
`;

const CsatDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: #F8FAFC;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
`;

const CsatScoreBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.04);
  border: 1px solid #E2E8F0;
`;

const CsatScore = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1;
`;

const CsatMax = styled.div`
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
  margin-top: 6px;
`;

const CsatStars = styled.div`
  font-size: 20px;
  color: #FBBF24;
  letter-spacing: 2px;
`;

export const Customer360Page = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, getOrdersForCustomer, getTicketsForCustomer, fetchDealers, fetchCustomers } = useCustomerData();

  const [activeTab, setActiveTab] = useState('Overview');
  const [isInitializing, setIsInitializing] = useState(true);

  const customer = customers.find(c => c.id === id);

  useEffect(() => {
    if (!customer && customers.length === 0) {
      Promise.all([fetchDealers(), fetchCustomers()]).finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, [customer, customers.length, fetchDealers, fetchCustomers]);

  if (isInitializing) {
    return (
      <PageWrapper style={{ padding: '24px' }}>
        <EmptyState>
          <IconClock size={40} style={{ marginBottom: '16px', color: '#CBD5E1' }} />
          <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 600 }}>Loading Profile</h3>
          <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>Please wait while we retrieve the CRM data...</p>
        </EmptyState>
      </PageWrapper>
    );
  }

  if (!customer) {
    return (
      <PageWrapper style={{ padding: '24px' }}>
        <EmptyState>
          <IconCircleXFilled size={40} style={{ marginBottom: '16px', color: '#EF4444' }} />
          <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 600 }}>Profile Not Found</h3>
          <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>The requested customer profile could not be located.</p>
          <ActionButton variant="primary" style={{ marginTop: '20px' }} onClick={() => navigate('/objects/companies')}>
            <IconArrowLeft size={14} /> Return to CRM
          </ActionButton>
        </EmptyState>
      </PageWrapper>
    );
  }

  const orders = getOrdersForCustomer(customer.id) || [];
  const tickets = getTicketsForCustomer(customer.id) || [];
  
  const locations = customer.locations && customer.locations.length > 0 
    ? customer.locations 
    : [{
        locationId: 'primary',
        locationName: 'Primary Address',
        contactPersonName: customer.contactPerson || customer.name,
        mobileNumber: customer.mobile,
        email: customer.email || '',
        country: customer.country || 'India',
        state: customer.state || '',
        city: customer.city || '',
        addressLine: customer.address || '',
        addressLine2: (customer as any).addressLine2 || '',
        landmark: (customer as any).landmark || '',
        pincode: customer.pincode || ''
      }];

  const totalOrdersCount = orders.length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const closedTicketsCount = tickets.filter(t => t.status === 'Closed').length;

  const tabs = [
    { id: 'Overview', icon: IconUser },
    { id: 'Addresses', icon: IconMapPin },
    { id: 'Orders', icon: IconShoppingCart },
    { id: 'Tickets', icon: IconTicket },
    { id: 'Communication', icon: IconMessageDots },
    { id: 'Feedback', icon: IconStar },
    { id: 'Documents', icon: IconFiles }
  ];

  const isActive = customer.health !== 'Inactive';
  const customerTypeIcon = customer.type === 'Dealer' ? <IconBuildingStore size={12} /> : <IconUser size={12} />;

  return (
    <>
      <PageTitle title={`${customer.name} - 360 View`} />
      <PageWrapper>
        <HeroHeader>
          <HeroTitleSection>
            <HeroAvatar bg={customer.color || '#3b82f6'}>{customer.initials}</HeroAvatar>
            <HeroTitleInfo>
              <HeroTitleRow>
                <HeroTitle>{customer.name}</HeroTitle>
                <Badge variant="customer">
                  {customerTypeIcon} {customer.type}
                </Badge>
                <Badge variant={isActive ? 'active' : 'inactive'}>
                  {isActive ? <IconCircleCheckFilled size={12} /> : <IconCircleXFilled size={12} />}
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
                {customer.dealerCode && (
                  <Badge variant="neutral">
                    <IconId size={12} /> {customer.dealerCode}
                  </Badge>
                )}
              </HeroTitleRow>
              <HeroSubtitle>
                <HeroIconText><IconPhone size={16} /> {customer.mobile || '—'}</HeroIconText>
                {customer.email && (
                  <HeroIconText><IconMail size={16} /> {customer.email}</HeroIconText>
                )}
                <HeroIconText><IconMapPin size={16} /> {customer.city ? `${customer.city}${customer.region ? `, ${customer.region}` : ''}` : '—'}</HeroIconText>
              </HeroSubtitle>
            </HeroTitleInfo>
          </HeroTitleSection>
          <HeroActions>
            <ActionButton onClick={() => navigate('/objects/companies')}>
              <IconArrowLeft size={16} /> Back
            </ActionButton>
          </HeroActions>
        </HeroHeader>

        <MainContent>
          <KpiGrid>
            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#EFF6FF" colorText="#2563EB"><IconShoppingCart size={18} /></KpiIconWrapper>
                <KpiLabel>Total Orders</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {totalOrdersCount > 0 ? (
                  <>
                    <KpiValue>{totalOrdersCount}</KpiValue>
                    <KpiTrend><TrendIndicator trend="up"><IconArrowUpRight size={12} /></TrendIndicator> Lifetime orders</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>No Orders</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> No history</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>

            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#FFF7ED" colorText="#F97316"><IconTicket size={18} /></KpiIconWrapper>
                <KpiLabel>Open Tickets</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {openTicketsCount > 0 ? (
                  <>
                    <KpiValue style={{ color: '#F97316' }}>{openTicketsCount}</KpiValue>
                    <KpiTrend><TrendIndicator trend="down"><IconArrowDownRight size={12} /></TrendIndicator> Requires attention</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>No Tickets</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> All clear</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>

            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#D1FAE5" colorText="#10B981"><IconChecklist size={18} /></KpiIconWrapper>
                <KpiLabel>Closed Tickets</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {closedTicketsCount > 0 ? (
                  <>
                    <KpiValue>{closedTicketsCount}</KpiValue>
                    <KpiTrend><TrendIndicator trend="up"><IconArrowUpRight size={12} /></TrendIndicator> Resolved issues</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>No Tickets</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> No resolved tickets</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>

            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#F3E8FF" colorText="#7C3AED"><IconStar size={18} /></KpiIconWrapper>
                <KpiLabel>CSAT Score</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {customer.avgCsat ? (
                  <>
                    <KpiValue>{customer.avgCsat} / 5</KpiValue>
                    <KpiTrend><TrendIndicator trend="up"><IconArrowUpRight size={12} /></TrendIndicator> Avg satisfaction</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>Not Rated</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> No feedback</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>

            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#D1FAE5" colorText="#10B981"><IconCurrencyRupee size={18} /></KpiIconWrapper>
                <KpiLabel>Lifetime Value</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {customer.ltv ? (
                  <>
                    <KpiValue>{customer.ltv}</KpiValue>
                    <KpiTrend><TrendIndicator trend="up"><IconArrowUpRight size={12} /></TrendIndicator> Total revenue</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>—</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> Pending txns</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>

            <KpiCard>
              <KpiHeader>
                <KpiIconWrapper className="icon-container" colorBg="#EEF2FF" colorText="#2563EB"><IconClock size={18} /></KpiIconWrapper>
                <KpiLabel>Last Interaction</KpiLabel>
              </KpiHeader>
              <KpiValueRow>
                {customer.lastInteractionDate ? (
                  <>
                    <KpiValue style={{ fontSize: '16px', margin: '3px 0' }}>{customer.lastInteractionDate}</KpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconClock size={12} /></TrendIndicator> Recent activity</KpiTrend>
                  </>
                ) : (
                  <>
                    <EmptyKpiValue>No Interaction</EmptyKpiValue>
                    <KpiTrend><TrendIndicator trend="neutral"><IconMinus size={12} /></TrendIndicator> No history</KpiTrend>
                  </>
                )}
              </KpiValueRow>
            </KpiCard>
          </KpiGrid>

          <TabsContainer>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                  <Icon size={14} /> {tab.id}
                </Tab>
              );
            })}
          </TabsContainer>

          <div style={{ minHeight: '200px' }}>
            {activeTab === 'Overview' && (
              <>
                <SectionGrid>
                  <SectionCard hoverBorderColor="#BFDBFE">
                    <SectionTitle bg="#EFF6FF" textColor="#2563EB"><IconUser size={18} color="#2563EB" /> Customer Information</SectionTitle>
                    <SectionBody>
                      <KvList>
                        <KvPair><KvKey>Customer Name</KvKey><KvValue>{customer.name || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Customer Type</KvKey><KvValue>{customer.type || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Mobile Number</KvKey><KvValue>{customer.mobile || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Email</KvKey><KvValue>{customer.email || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>City</KvKey><KvValue>{customer.city || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Region</KvKey><KvValue>{customer.region || '—'}</KvValue></KvPair>
                      </KvList>
                    </SectionBody>
                  </SectionCard>

                  <SectionCard hoverBorderColor="#D8B4FE">
                    <SectionTitle bg="#F3E8FF" textColor="#7C3AED"><IconBriefcase size={18} color="#7C3AED" /> Business Information</SectionTitle>
                    <SectionBody>
                      <KvList>
                        <KvPair><KvKey>Business Type</KvKey><KvValue>{customer.type || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Segment</KvKey><KvValue>{customer.segment || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Source</KvKey><KvValue>{customer.source || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Business Potential</KvKey><KvValue>{customer.potential || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Dealer Code</KvKey><KvValue>{customer.dealerCode || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Region</KvKey><KvValue>{customer.region || '—'}</KvValue></KvPair>
                      </KvList>
                    </SectionBody>
                  </SectionCard>
                </SectionGrid>

                <SectionGrid style={{ marginTop: '16px' }}>
                  <SectionCard hoverBorderColor="#6EE7B7">
                    <SectionTitle bg="#ECFDF5" textColor="#10B981"><IconTarget size={18} color="#10B981" /> Segmentation</SectionTitle>
                    <SectionBody>
                      <KvList>
                        <KvPair><KvKey>Segment</KvKey><KvValue>{customer.segment || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Business Type</KvKey><KvValue>{customer.type || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Source</KvKey><KvValue>{customer.source || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Region</KvKey><KvValue>{customer.region || '—'}</KvValue></KvPair>
                        <KvPair><KvKey>Potential</KvKey><KvValue>{customer.potential || '—'}</KvValue></KvPair>
                      </KvList>
                    </SectionBody>
                  </SectionCard>

                  <SectionCard hoverBorderColor="#FDBA74">
                    <SectionTitle bg="#FFF7ED" textColor="#F97316"><IconMapPin size={18} color="#F97316" /> Address Information</SectionTitle>
                    <SectionBody>
                      {locations.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>
                            {locations[0].locationName || 'Primary Address'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                            {locations[0].addressLine && <div>{locations[0].addressLine}</div>}
                            <div>{[locations[0].city, locations[0].state, locations[0].pincode].filter(Boolean).join(', ') || '—'}</div>
                            {locations[0].country && <div>{locations[0].country}</div>}
                          </div>
                          {locations.length > 1 && (
                            <div 
                              style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, marginTop: '6px', cursor: 'pointer', display: 'inline-block' }} 
                              onClick={() => setActiveTab('Addresses')}
                            >
                              + {locations.length - 1} more locations
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: '#64748B', fontSize: '13px', fontWeight: 500 }}>No address information available</div>
                      )}
                    </SectionBody>
                  </SectionCard>
                </SectionGrid>

                <WidgetGrid style={{ marginTop: '16px' }}>
                  <WidgetContainer hoverBorderColor="#BFDBFE">
                    <WidgetHeader bg="#EFF6FF" color="#2563EB">
                      <IconClock size={20} /> Recent Activity
                    </WidgetHeader>
                    <WidgetBody>
                      <WidgetEmpty>
                        <WidgetEmptyIconContainer bg="#EFF6FF" color="#2563EB">
                          <IconClock size={36} stroke={1.5} />
                        </WidgetEmptyIconContainer>
                        <WidgetEmptyTitle>No recent activity</WidgetEmptyTitle>
                        <WidgetEmptyDesc>Activity history will appear here when available.</WidgetEmptyDesc>
                      </WidgetEmpty>
                    </WidgetBody>
                  </WidgetContainer>

                  <WidgetContainer hoverBorderColor="#FDBA74">
                    <WidgetHeader bg="#FFF7ED" color="#F97316">
                      <IconTicket size={20} /> Recent Tickets
                    </WidgetHeader>
                    <WidgetBody>
                      {tickets.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {tickets.slice(0, 3).map(t => (
                            <WidgetItem key={t.id}>
                              <WidgetIconBox bg="#FFEDD5" color="#F97316"><IconTicket size={16} /></WidgetIconBox>
                              <WidgetContent>
                                <WidgetTitleRow>
                                  <WidgetTitle>#{t.id} - {t.subject}</WidgetTitle>
                                </WidgetTitleRow>
                                <WidgetDesc>
                                  <Badge variant={t.status === 'Open' ? 'danger' : (t.status === 'Closed' ? 'success' : 'neutral')} style={{ padding: '2px 6px', fontSize: '10px', marginTop: '2px' }}>
                                    {t.status}
                                  </Badge>
                                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#64748B' }}>{t.date}</span>
                                </WidgetDesc>
                              </WidgetContent>
                            </WidgetItem>
                          ))}
                          {tickets.length > 3 && (
                            <div 
                              style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, marginTop: '8px', cursor: 'pointer', textAlign: 'center' }} 
                              onClick={() => setActiveTab('Tickets')}
                            >
                              View all
                            </div>
                          )}
                        </div>
                      ) : (
                        <WidgetEmpty>
                          <WidgetEmptyIconContainer bg="#FFF7ED" color="#F97316">
                            <IconTicket size={36} stroke={1.5} />
                          </WidgetEmptyIconContainer>
                          <WidgetEmptyTitle>No recent tickets</WidgetEmptyTitle>
                          <WidgetEmptyDesc>Support tickets will appear here when available.</WidgetEmptyDesc>
                        </WidgetEmpty>
                      )}
                    </WidgetBody>
                  </WidgetContainer>

                  <WidgetContainer hoverBorderColor="#D8B4FE">
                    <WidgetHeader bg="#F3E8FF" color="#7C3AED">
                      <IconCalendarEvent size={20} /> Recent Follow-ups
                    </WidgetHeader>
                    <WidgetBody>
                      <WidgetEmpty>
                        <WidgetEmptyIconContainer bg="#F3E8FF" color="#7C3AED">
                          <IconCalendarEvent size={36} stroke={1.5} />
                        </WidgetEmptyIconContainer>
                        <WidgetEmptyTitle>No recent follow-ups</WidgetEmptyTitle>
                        <WidgetEmptyDesc>Follow-up activities will appear here when available.</WidgetEmptyDesc>
                      </WidgetEmpty>
                    </WidgetBody>
                  </WidgetContainer>
                </WidgetGrid>
              </>
            )}

            {activeTab === 'Addresses' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconMapPin size={20} color="#2563EB" /> Saved Locations
                </h3>
                {locations.length > 0 ? (
                  <AddressGrid>
                    {locations.map((loc, index) => (
                      <AddressCard key={loc.locationId || index}>
                        <AddressTitle>{loc.locationName || `Address ${index + 1}`}</AddressTitle>
                        <AddressText>
                          <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>{loc.contactPersonName || customer.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><IconPhone size={14} color="#64748B" /> {loc.mobileNumber || customer.mobile || '—'}</div>
                          {loc.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><IconMail size={14} color="#64748B" /> {loc.email}</div>}
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                            {loc.addressLine && <div>{loc.addressLine}</div>}
                            <div>
                              {[loc.city, loc.state, loc.pincode].filter(Boolean).join(', ') || '—'}
                            </div>
                            {loc.country && <div>{loc.country}</div>}
                          </div>
                        </AddressText>
                      </AddressCard>
                    ))}
                  </AddressGrid>
                ) : (
                  <EmptyState>
                    <IconMapPin size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Addresses Found</h3>
                    <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>There are no saved addresses for this customer.</p>
                  </EmptyState>
                )}
              </div>
            )}

            {activeTab === 'Orders' && (
              <SectionCard>
                <SectionTitle><IconShoppingCart size={20} color="#2563EB" /> Order History</SectionTitle>
                {orders.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <thead><tr><Th>Date</Th><Th>Amount</Th><Th>Status</Th></tr></thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <Td>{o.date || '—'}</Td>
                            <Td style={{ fontWeight: 600, color: '#0F172A' }}>{o.amount || '—'}</Td>
                            <Td>
                              <Badge variant={o.status === 'Delivered' ? 'success' : 'neutral'}>{o.status || '—'}</Badge>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <EmptyState>
                    <IconReceipt size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Order History</h3>
                    <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>This customer hasn't placed any orders yet.</p>
                  </EmptyState>
                )}
              </SectionCard>
            )}

            {activeTab === 'Tickets' && (
              <SectionCard>
                <SectionTitle><IconTicket size={20} color="#2563EB" /> Support Tickets</SectionTitle>
                {tickets.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <thead><tr><Th>Ticket ID</Th><Th>Subject</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                      <tbody>
                        {tickets.map(t => (
                          <tr key={t.id}>
                            <Td style={{ fontWeight: 600, color: '#0F172A' }}>#{t.id}</Td>
                            <Td>{t.subject || '—'}</Td>
                            <Td>
                              <Badge variant={t.status === 'Open' ? 'danger' : (t.status === 'Closed' ? 'success' : 'neutral')}>
                                {t.status || '—'}
                              </Badge>
                            </Td>
                            <Td>{t.date || '—'}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <EmptyState>
                    <IconTicket size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Support Tickets</h3>
                    <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>There are no recorded support tickets for this customer.</p>
                  </EmptyState>
                )}
              </SectionCard>
            )}

            {activeTab === 'Communication' && (
              <SectionCard>
                <SectionTitle><IconMessageDots size={20} color="#2563EB" /> Communication Timeline</SectionTitle>
                <EmptyState>
                  <IconMessageDots size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Communication History</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>There are no logged calls, emails, or meetings with this customer.</p>
                </EmptyState>
              </SectionCard>
            )}

            {activeTab === 'Feedback' && (
              <SectionCard>
                <SectionTitle><IconStar size={20} color="#2563EB" /> Customer Feedback & CSAT</SectionTitle>
                {customer.avgCsat ? (
                  <>
                    <CsatDisplay>
                      <CsatScoreBlock>
                        <CsatScore>{customer.avgCsat}</CsatScore>
                        <CsatMax>out of 5</CsatMax>
                      </CsatScoreBlock>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Average Satisfaction Rating</div>
                        <CsatStars>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ opacity: i < Math.floor(parseFloat(customer.avgCsat)) ? 1 : 0.2 }}>★</span>
                          ))}
                        </CsatStars>
                      </div>
                    </CsatDisplay>
                    
                    <h4 style={{ margin: '24px 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Recent Comments</h4>
                    <TimelineContainer>
                      <TimelineItem>
                        <TimelineDot color="#8B5CF6" />
                        <TimelineContent>
                          <TimelineHeader>
                            <TimelineTitle>Positive Experience</TimelineTitle>
                            <TimelineDate>Recently</TimelineDate>
                          </TimelineHeader>
                          <TimelineDesc>"Support team was extremely helpful and resolved the issue quickly."</TimelineDesc>
                        </TimelineContent>
                      </TimelineItem>
                    </TimelineContainer>
                  </>
                ) : (
                  <EmptyState>
                    <IconStar size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Feedback Available</h3>
                    <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>This customer hasn't provided any satisfaction ratings yet.</p>
                  </EmptyState>
                )}
              </SectionCard>
            )}

            {activeTab === 'Documents' && (
              <SectionCard>
                <SectionTitle><IconFiles size={20} color="#2563EB" /> Customer Documents</SectionTitle>
                <EmptyState>
                  <IconFiles size={40} style={{ marginBottom: '12px', color: '#94A3B8' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>No Documents</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>There are no attached files or contracts for this profile.</p>
                </EmptyState>
              </SectionCard>
            )}
          </div>
        </MainContent>
      </PageWrapper>
    </>
  );
};
