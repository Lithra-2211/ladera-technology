import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 32px 40px;
  background-color: #fcfaf9; /* Matching the slight tint from image */
  overflow-y: auto;
  font-family: system-ui, -apple-system, sans-serif;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #666;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ primary?: boolean }>`
  background-color: ${props => props.primary ? '#e04c38' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.primary ? '#e04c38' : '#e5e7eb'};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:hover {
    opacity: 0.9;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetricIcon = styled.div<{ bg: string; color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${props => props.bg};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
`;

const MetricTitle = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const MetricSubtext = styled.div<{ color: string }>`
  font-size: 13px;
  color: ${props => props.color};
  font-weight: 600;
`;

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TableTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
`;

const TableSubtitle = styled.span`
  font-size: 13px;
  color: #888;
`;

const TableFilterButton = styled(Button)`
  border-radius: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  border-bottom: 1px solid #f0f0f0;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 16px 8px;
  font-size: 14px;
  color: #1a1a1a;
  border-bottom: 1px solid #f8f8f8;
  font-weight: 500;
`;

const IdText = styled.span`
  color: #666;
  font-weight: 600;
`;

const Badge = styled.span<{ bg: string; color: string }>`
  background-color: ${props => props.bg};
  color: ${props => props.color};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
`;

const SlaText = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: 600;
`;

// New Ticket Modal Overlay and Content
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  
  &:hover {
    background: #eff6ff;
  }
`;

const INITIAL_TICKETS_DATA = [
  { id: '#2214', customer: 'Kavitha M.', issue: 'Recliner mechanism stuck', category: 'Warranty - Defect', status: 'Escalated', sla: '58 min left', statusBg: '#fce8e8', statusColor: '#e04c38', slaColor: '#e04c38', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
  { id: '#2211', customer: 'Suresh B.', issue: 'Wardrobe scratch on delivery', category: 'Delivery - Damage', status: 'In progress', sla: '4h left', statusBg: '#fff3cd', statusColor: '#b48811', slaColor: '#d97706', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
  { id: '#2208', customer: 'Chennai Homes LLP', issue: 'Invoice INV-86990 mismatch', category: 'Billing', status: 'In progress', sla: '6h left', statusBg: '#f3e8ff', statusColor: '#7e22ce', slaColor: '#d97706', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
  { id: '#2205', customer: 'Faisal A.', issue: 'Assembly visit request', category: 'Installation', status: 'Assigned', sla: '22h left', statusBg: '#fce7f3', statusColor: '#be185d', slaColor: '#059669', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
  { id: '#2201', customer: 'Nair Living', issue: 'Drawer rail replacement', category: 'Spare part', status: 'Awaiting parts', sla: '18h left', statusBg: '#f3f4f6', statusColor: '#4b5563', slaColor: '#d97706', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
  { id: '#2196', customer: 'Iyer Estates', issue: 'Bed frame installation query', category: 'Query', status: 'Resolved', sla: 'Met', statusBg: '#d1fae5', statusColor: '#059669', slaColor: '#059669', categoryBg: '#f3f4f6', categoryColor: '#6b7280' },
];

export const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState(INITIAL_TICKETS_DATA);

  const [formData, setFormData] = useState({
    customer: '',
    issue: '',
    category: 'Query',
    status: 'In progress',
    sla: '24h left'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingTicketId(null);
    setFormData({ customer: '', issue: '', category: 'Query', status: 'In progress', sla: '24h left' });
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: any) => {
    setEditingTicketId(ticket.id);
    setFormData({
      customer: ticket.customer,
      issue: ticket.issue,
      category: ticket.category,
      status: ticket.status,
      sla: ticket.sla,
    });
    setIsModalOpen(true);
  };

  const handleSaveTicket = () => {
    // Assign some default colors based on status
    let statusBg = '#fff3cd';
    let statusColor = '#b48811';
    if (formData.status === 'Resolved') {
      statusBg = '#d1fae5'; statusColor = '#059669';
    } else if (formData.status === 'Escalated') {
      statusBg = '#fce8e8'; statusColor = '#e04c38';
    } else if (formData.status === 'Awaiting parts') {
      statusBg = '#f3f4f6'; statusColor = '#4b5563';
    } else if (formData.status === 'Assigned') {
      statusBg = '#fce7f3'; statusColor = '#be185d';
    }

    if (editingTicketId) {
      // Edit existing
      setTickets(tickets.map(t => t.id === editingTicketId ? {
        ...t,
        ...formData,
        statusBg,
        statusColor,
      } : t));
    } else {
      // Create new
      const newId = '#' + Math.floor(1000 + Math.random() * 9000);
      const newTicket = {
        id: newId,
        customer: formData.customer || 'Unknown Customer',
        issue: formData.issue || 'No issue description',
        category: formData.category,
        status: formData.status,
        sla: formData.sla || 'N/A',
        statusBg,
        statusColor,
        slaColor: '#d97706', // Default warning color
        categoryBg: '#f3f4f6',
        categoryColor: '#6b7280',
      };
      setTickets([newTicket, ...tickets]);
    }
    
    setIsModalOpen(false);
  };

  const totalTickets = tickets.length;
  const atRiskTickets = tickets.filter(t => t.status === 'Escalated' || t.sla.includes('min')).length;
  const resolvedPercent = Math.round((tickets.filter(t => t.status === 'Resolved').length / (totalTickets || 1)) * 100);
  const inProgressTickets = tickets.filter(t => t.status === 'In progress').length; // For the 3rd card mock

  return (
    <>
      <PageTitle title="Tickets" />
      <Container>
        <HeaderSection>
          <TitleGroup>
            <Title>Tickets</Title>
            <Subtitle>Omnichannel complaints — auto-categorized, routed and SLA-tracked.</Subtitle>
          </TitleGroup>
          <HeaderButtons>
            <Button primary onClick={openCreateModal}>+ New ticket</Button>
          </HeaderButtons>
        </HeaderSection>

        <MetricsContainer>
          <MetricCard>
            <MetricIcon bg="#fce8e8" color="#e04c38">🎫</MetricIcon>
            <MetricValue>{totalTickets}</MetricValue>
            <MetricTitle>Total tickets</MetricTitle>
            <MetricSubtext color="#e04c38">Dynamically updated</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricIcon bg="#fce8e8" color="#e04c38">⚠️</MetricIcon>
            <MetricValue>{atRiskTickets}</MetricValue>
            <MetricTitle>At SLA risk</MetricTitle>
            <MetricSubtext color="#e04c38">{atRiskTickets > 0 ? 'Action required' : 'All good'}</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricIcon bg="#fff3cd" color="#d97706">⏱️</MetricIcon>
            <MetricValue>{inProgressTickets}</MetricValue>
            <MetricTitle>In progress</MetricTitle>
            <MetricSubtext color="#d97706">Currently being worked on</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricIcon bg="#d1fae5" color="#059669">✔️</MetricIcon>
            <MetricValue>{resolvedPercent}%</MetricValue>
            <MetricTitle>Resolved within TAT</MetricTitle>
            <MetricSubtext color="#059669">Overall completion</MetricSubtext>
          </MetricCard>
        </MetricsContainer>

        <TableContainer>
          <TableHeader>
            <TableTitleGroup>
              <TableTitle>Live queue</TableTitle>
              <TableSubtitle>Registration • categorization • routing • lifecycle</TableSubtitle>
            </TableTitleGroup>
            <TableFilterButton>All categories</TableFilterButton>
          </TableHeader>
          <Table>
            <thead>
              <tr>
                <Th>TICKET</Th>
                <Th>CUSTOMER</Th>
                <Th>ISSUE</Th>
                <Th>CATEGORY</Th>
                <Th>STATUS</Th>
                <Th align="right" style={{ textAlign: 'right' }}>SLA</Th>
                <Th align="right" style={{ textAlign: 'right' }}>ACTIONS</Th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, i) => (
                <tr key={ticket.id}>
                  <Td><IdText>{ticket.id}</IdText></Td>
                  <Td>{ticket.customer}</Td>
                  <Td>{ticket.issue}</Td>
                  <Td>
                    <Badge bg={ticket.categoryBg} color={ticket.categoryColor}>
                      {ticket.category}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge bg={ticket.statusBg} color={ticket.statusColor}>
                      {ticket.status}
                    </Badge>
                  </Td>
                  <Td align="right" style={{ textAlign: 'right' }}>
                    <SlaText color={ticket.slaColor}>{ticket.sla}</SlaText>
                  </Td>
                  <Td align="right" style={{ textAlign: 'right' }}>
                    <EditButton onClick={() => openEditModal(ticket)}>Edit</EditButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Container>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingTicketId ? 'Edit Ticket' : 'Create New Ticket'}</ModalTitle>
            <FormGroup>
              <Label>Customer Name</Label>
              <Input name="customer" value={formData.customer} onChange={handleInputChange} placeholder="Enter customer name" />
            </FormGroup>
            <FormGroup>
              <Label>Issue Description</Label>
              <Input name="issue" value={formData.issue} onChange={handleInputChange} placeholder="Describe the issue" />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Warranty - Defect">Warranty - Defect</option>
                <option value="Delivery - Damage">Delivery - Damage</option>
                <option value="Billing">Billing</option>
                <option value="Installation">Installation</option>
                <option value="Spare part">Spare part</option>
                <option value="Query">Query</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="In progress">In progress</option>
                <option value="Escalated">Escalated</option>
                <option value="Assigned">Assigned</option>
                <option value="Awaiting parts">Awaiting parts</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>SLA (e.g. 24h left)</Label>
              <Input name="sla" value={formData.sla} onChange={handleInputChange} placeholder="Enter SLA" />
            </FormGroup>
            <HeaderButtons style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button primary onClick={handleSaveTicket}>{editingTicketId ? 'Save Changes' : 'Create'}</Button>
            </HeaderButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
