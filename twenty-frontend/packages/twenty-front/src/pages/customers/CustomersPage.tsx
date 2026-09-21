import React, { useState, useMemo } from 'react';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCustomerData, CustomerRecord } from './context/CustomerDataContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fafafa;
  position: relative;
`;

const TopGlobalBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background-color: #fafafa;
  border-bottom: 1px solid transparent;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
  margin-left: 16px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 14px;
`;

const SearchInput = styled.input`
  padding: 8px 12px 8px 36px;
  border-radius: 20px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  outline: none;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
  
  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const GlobalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background-color: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;

  &:hover {
    background-color: ${themeCssVariables.background.transparent.light};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ef4444; /* matching the SW avatar red color */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const UserRole = styled.div`
  font-size: 11px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const ChevronDown = styled.div`
  font-size: 10px;
  color: ${themeCssVariables.font.color.secondary};
  margin-left: 4px;
`;

const PageContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 32px 24px;
  width: 100%;
  box-sizing: border-box;
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean; small?: boolean }>`
  padding: ${({ small }) => (small ? '6px 12px' : '8px 16px')};
  border-radius: 20px;
  font-size: ${({ small }) => (small ? '12px' : '13px')};
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ primary, danger }) => (primary || danger ? 'transparent' : themeCssVariables.border.color.medium)};
  background-color: ${({ primary, danger }) => (primary ? themeCssVariables.color.red : danger ? '#fee2e2' : 'white')};
  color: ${({ primary, danger }) => (primary ? 'white' : danger ? '#ef4444' : themeCssVariables.font.color.primary)};
  box-shadow: ${({ primary }) => (primary ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)')};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 32px 32px;
  flex: 1;
  overflow-y: auto;
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const KpiCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
`;

const IconWrapper = styled.div<{ color: string; bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const KpiValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const KpiLabel = styled.div`
  font-size: 13px;
  color: ${themeCssVariables.font.color.secondary};
`;

const KpiTrend = styled.div<{ color?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color || '#10b981'};
`;

const MasterSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  overflow: hidden;
`;

const MasterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const TableContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  padding: 12px 24px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const Td = styled.td`
  padding: 12px 24px;
  font-size: 13px;
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  white-space: nowrap;

  &:first-child {
    color: ${themeCssVariables.font.color.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const AvatarCircle = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
`;

const Tag = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type }) => (type === 'Active' ? '#dcfce7' : type === 'At risk' ? '#ffedd5' : '#f3f4f6')};
  color: ${({ type }) => (type === 'Active' ? '#166534' : type === 'At risk' ? '#9a3412' : '#4b5563')};
`;

const OpenTicketsText = styled.span<{ count: number }>`
  color: ${({ count }) => (count > 0 ? '#ef4444' : themeCssVariables.font.color.secondary)};
  font-weight: ${({ count }) => (count > 0 ? '600' : '400')};
`;

const DrawerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const DrawerContent = styled.div`
  width: 500px;
  background: white;
  height: 100%;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

const DrawerHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DrawerFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.secondary};
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  background: white;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 11px;
`;

const Alert = styled.div`
  padding: 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
`;

const ActionMenu = styled.div`
  display: flex;
  gap: 8px;
`;

const Toast = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  z-index: 2000;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;

const customerSchema = z.object({
  type: z.enum(['Customer', 'Dealer', 'Distributor', 'Carpenter', 'Influencer']),
  name: z.string().min(1, "Customer Name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Invalid email").or(z.literal('')),
  address: z.string(),
  city: z.string().min(1, "City is required"),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  source: z.string(),
  segment: z.string(),
  region: z.string(),
  potential: z.string(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerData();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      type: 'Customer', name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '', dealerCode: '', source: '', segment: '', region: '', potential: '', notes: ''
    }
  });

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const lowerQ = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowerQ) ||
      c.mobile.includes(lowerQ) ||
      (c.email && c.email.toLowerCase().includes(lowerQ)) ||
      c.city.toLowerCase().includes(lowerQ) ||
      (c.dealerCode && c.dealerCode.toLowerCase().includes(lowerQ))
    );
  }, [customers, searchQuery]);

  const kpis = [
    { icon: '👥', iconColor: '#ef4444', iconBg: '#fee2e2', value: customers.length.toString(), label: 'Total customers', trend: '▲ 214 this month', trendColor: '#10b981' },
    { icon: '🔄', iconColor: '#10b981', iconBg: '#dcfce7', value: '31%', label: 'Repeat purchase rate', trend: '▲ 3.2 pts', trendColor: '#10b981' },
    { icon: '⭐', iconColor: '#f59e0b', iconBg: '#fef3c7', value: '4.6', label: 'Avg CSAT - 90d', trend: '3,902 responses', trendColor: '#10b981' },
    { icon: '₹', iconColor: '#8b5cf6', iconBg: '#ede9fe', value: '₹28.4K', label: 'Avg lifetime value', trend: '▲ 9%', trendColor: '#10b981' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openDrawer = (customer?: CustomerRecord) => {
    setSubmitError('');
    if (customer) {
      setEditingCustomer(customer);
      reset({
        type: customer.type, name: customer.name, mobile: customer.mobile, email: customer.email, address: customer.address, city: customer.city, state: customer.state, country: 'India', pincode: customer.pincode, source: customer.source, segment: customer.segment, region: customer.region, potential: customer.potential
      });
    } else {
      setEditingCustomer(null);
      reset({
        type: 'Customer', name: '', mobile: '', email: '', address: '', city: '', state: '', country: 'India', pincode: '', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium'
      });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onSubmit = (data: CustomerFormValues) => {
    setSubmitError('');
    const { country, ...rest } = data;
    const dbData = { ...rest, dealerCode: '', notes: '' };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, dbData);
      closeDrawer();
      showToast('Customer updated successfully');
    } else {
      const res = addCustomer(dbData);
      if (res.success) {
        closeDrawer();
        showToast('Customer added successfully');
      } else {
        setSubmitError(res.error || 'Unknown error occurred.');
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <>
      <PageTitle title="Customers" />
      <PageWrapper>
        <TopGlobalBar>
          <SearchInputWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput 
              placeholder="Search customers, tickets, deals... (/)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>
          <GlobalActions>
            <IconButton>🔔</IconButton>
            <IconButton>❓</IconButton>
            <UserProfile>
              <Avatar>SW</Avatar>
              <UserInfo>
                <UserName>Sawan</UserName>
                <UserRole>Administrator</UserRole>
              </UserInfo>
              <ChevronDown>▼</ChevronDown>
            </UserProfile>
          </GlobalActions>
        </TopGlobalBar>
        
        <PageContainer>
          <PageHeader>
            <TitleSection>
              <Title>Customers</Title>
              <Subtitle>One 360° record — orders, tickets, warranty and invoices together.</Subtitle>
            </TitleSection>
            
            <HeaderActions>
              <Button>Sync from ERP</Button>
              <Button primary onClick={() => openDrawer()}>+ New customer</Button>
            </HeaderActions>
          </PageHeader>
          
          <Grid>
            <KpiRow>
              {kpis.map((kpi, i) => (
                <KpiCard key={i}>
                  <IconWrapper color={kpi.iconColor} bg={kpi.iconBg}>
                    {kpi.icon}
                  </IconWrapper>
                  <div>
                    <KpiValue>{kpi.value}</KpiValue>
                    <KpiLabel>{kpi.label}</KpiLabel>
                    <KpiTrend color={kpi.trendColor}>{kpi.trend}</KpiTrend>
                  </div>
                </KpiCard>
              ))}
            </KpiRow>

            <MasterSection>
              <MasterHeader>
                <TitleSection>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: themeCssVariables.font.color.primary }}>
                    Customer master
                  </h3>
                  <Subtitle>Synced with SAP · updated just now</Subtitle>
                </TitleSection>
                <Button>All segments</Button>
              </MasterHeader>
              
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>CUSTOMER</Th>
                      <Th>CITY</Th>
                      <Th>SEGMENT</Th>
                      <Th>LIFETIME VALUE</Th>
                      <Th>ORDERS</Th>
                      <Th>OPEN TICKETS</Th>
                      <Th>HEALTH</Th>
                      <Th>ACTIONS</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <Td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                          No customers found matching your search.
                        </Td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id}>
                          <Td>
                            <AvatarCircle color={c.color}>{c.initials}</AvatarCircle>
                            {c.name}
                          </Td>
                          <Td>{c.city}</Td>
                          <Td><Tag type="Segment">{c.segment}</Tag></Td>
                          <Td>{c.ltv}</Td>
                          <Td>{c.orders}</Td>
                          <Td><OpenTicketsText count={c.openTickets}>{c.openTickets}</OpenTicketsText></Td>
                          <Td><Tag type={c.health}>{c.health}</Tag></Td>
                          <Td>
                            <ActionMenu>
                              <Button small onClick={() => navigate(`/customers/${c.id}`)}>View 360</Button>
                              <Button small onClick={() => openDrawer(c)}>Edit</Button>
                              <Button small danger onClick={() => handleDelete(c.id, c.name)}>Delete</Button>
                            </ActionMenu>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </TableContainer>
            </MasterSection>
          </Grid>
        </PageContainer>

        {isDrawerOpen && (
          <DrawerOverlay onClick={closeDrawer}>
            <DrawerContent onClick={e => e.stopPropagation()}>
              <DrawerHeader>
                <Title style={{ fontSize: '18px' }}>{editingCustomer ? 'Edit Customer' : 'New Customer'}</Title>
                <div style={{ cursor: 'pointer', fontSize: '20px', color: themeCssVariables.font.color.tertiary }} onClick={closeDrawer}>&times;</div>
              </DrawerHeader>
              <DrawerBody>
                {submitError && <Alert>{submitError}</Alert>}
                <form id="customer-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <FormGroup>
                    <Label>Customer Type</Label>
                    <Select {...register('type')}>
                      <option value="Customer">Customer</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Influencer">Influencer</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Customer Name *</Label>
                    <Input {...register('name')} placeholder="Enter full name" />
                    {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Mobile Number *</Label>
                    <Input {...register('mobile')} placeholder="Enter 10-digit number" />
                    {errors.mobile && <ErrorText>{errors.mobile.message}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Email</Label>
                    <Input {...register('email')} placeholder="Email address" type="email" />
                    {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                  </FormGroup>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormGroup>
                      <Label>Country</Label>
                      <Select {...register('country')}>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>State</Label>
                      <Select {...register('state')}>
                        <option value="">Select State</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </Select>
                    </FormGroup>
                  </div>

                  <FormGroup>
                    <Label>City *</Label>
                    <Input {...register('city')} placeholder="City name" />
                    {errors.city && <ErrorText>{errors.city.message}</ErrorText>}
                  </FormGroup>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormGroup>
                      <Label>Address</Label>
                      <Input {...register('address')} />
                    </FormGroup>
                    <FormGroup>
                      <Label>Pincode</Label>
                      <Input {...register('pincode')} />
                    </FormGroup>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormGroup>
                      <Label>Source</Label>
                      <Select {...register('source')}>
                        <option value="Website">Website</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Referral">Referral</option>
                        <option value="Campaign">Campaign</option>
                        <option value="Dealer Portal">Dealer Portal</option>
                        <option value="Field Sales">Field Sales</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Segment</Label>
                      <Select {...register('segment')}>
                        <option value="Retail">Retail</option>
                        <option value="Dealer">Dealer</option>
                        <option value="B2B">B2B</option>
                      </Select>
                    </FormGroup>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormGroup>
                      <Label>Region</Label>
                      <Select {...register('region')}>
                        <option value="South">South</option>
                        <option value="North">North</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Business Potential</Label>
                      <Select {...register('potential')}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </Select>
                    </FormGroup>
                  </div>

                </form>
              </DrawerBody>
              <DrawerFooter>
                <Button type="button" onClick={closeDrawer}>Cancel</Button>
                <Button primary type="submit" form="customer-form">Create Customer</Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        )}

        {toastMessage && (
          <Toast>
            {toastMessage}
          </Toast>
        )}
      </PageWrapper>
    </>
  );
};
