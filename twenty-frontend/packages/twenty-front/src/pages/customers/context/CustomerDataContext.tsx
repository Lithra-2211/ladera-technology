import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type CustomerHealth = 'Active' | 'At risk' | 'Inactive';
export type CustomerType = 'Customer' | 'Dealer' | 'Distributor' | 'Carpenter' | 'Influencer';

export interface CustomerRecord {
  id: string;
  type: CustomerType;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dealerCode?: string;
  source: string;
  segment: string;
  region: string;
  potential: string;
  notes: string;
  health: CustomerHealth;
  ltv: string;
  orders: number;
  openTickets: number;
  closedTickets: number;
  avgCsat: string;
  lastInteractionDate: string;
  color: string;
  initials: string;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  date: string;
  amount: string;
  status: string;
}

export interface CustomerTicket {
  id: string;
  customerId: string;
  date: string;
  subject: string;
  status: 'Open' | 'Closed' | 'In Progress';
}

interface CustomerDataContextType {
  customers: CustomerRecord[];
  addCustomer: (customer: Omit<CustomerRecord, 'id' | 'health' | 'ltv' | 'orders' | 'openTickets' | 'closedTickets' | 'avgCsat' | 'lastInteractionDate' | 'color' | 'initials'>) => { success: boolean; error?: string };
  updateCustomer: (id: string, customer: Partial<CustomerRecord>) => void;
  deleteCustomer: (id: string) => void;
  getOrdersForCustomer: (customerId: string) => CustomerOrder[];
  getTicketsForCustomer: (customerId: string) => CustomerTicket[];
}

const generateInitials = (name: string) => {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

const getRandomColor = () => {
  const colors = ['#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#64748b', '#3b82f6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initialCustomers: CustomerRecord[] = [
  { id: '1', type: 'Customer', name: 'Kavitha M.', mobile: '9876543210', email: 'kavitha@example.com', address: '123 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', source: 'Website', segment: 'Retail', region: 'South', potential: 'High', notes: 'Frequent buyer.', health: 'Active', ltv: '₹2.34L', orders: 4, openTickets: 1, closedTickets: 2, avgCsat: '4.8', lastInteractionDate: '2023-10-12', color: '#10b981', initials: 'KM' },
  { id: '2', type: 'Dealer', name: 'Sundar Interiors', mobile: '9876543211', email: 'sundar@example.com', address: '45 DB Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002', dealerCode: 'D-001', source: 'Field Sales', segment: 'Dealer', region: 'South', potential: 'Very High', notes: 'Key dealer in region.', health: 'Active', ltv: '₹18.2L', orders: 46, openTickets: 2, closedTickets: 15, avgCsat: '4.5', lastInteractionDate: '2023-10-11', color: '#8b5cf6', initials: 'SI' },
  { id: '3', type: 'Customer', name: 'Chennai Homes LLP', mobile: '9876543212', email: 'chennaihomes@example.com', address: 'OMR', city: 'Chennai', state: 'Tamil Nadu', pincode: '600119', source: 'Referral', segment: 'B2B', region: 'South', potential: 'High', notes: '', health: 'Active', ltv: '₹32.6L', orders: 12, openTickets: 0, closedTickets: 5, avgCsat: '4.9', lastInteractionDate: '2023-10-10', color: '#ef4444', initials: 'CH' },
  { id: '4', type: 'Customer', name: 'Faisal A.', mobile: '9876543213', email: 'faisal@example.com', address: 'Main Bazar', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', source: 'WhatsApp', segment: 'Retail', region: 'South', potential: 'Low', notes: 'Price sensitive.', health: 'At risk', ltv: '₹86K', orders: 2, openTickets: 1, closedTickets: 0, avgCsat: '3.2', lastInteractionDate: '2023-09-15', color: '#f59e0b', initials: 'FA' },
  { id: '5', type: 'Customer', name: 'GreenNext Villas', mobile: '9876543214', email: 'greennext@example.com', address: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', source: 'Campaign', segment: 'B2B', region: 'South', potential: 'Medium', notes: '', health: 'Active', ltv: '₹41.9L', orders: 9, openTickets: 0, closedTickets: 8, avgCsat: '4.7', lastInteractionDate: '2023-10-08', color: '#10b981', initials: 'GV' },
  { id: '6', type: 'Customer', name: 'Priyanka T.', mobile: '9876543215', email: 'priyanka@example.com', address: 'MG Road', city: 'Kochi', state: 'Kerala', pincode: '682011', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium', notes: '', health: 'At risk', ltv: '₹1.12L', orders: 3, openTickets: 2, closedTickets: 1, avgCsat: '3.5', lastInteractionDate: '2023-08-20', color: '#64748b', initials: 'PT' },
];

const mockOrders: CustomerOrder[] = [
  { id: 'o1', customerId: '1', date: '2023-10-01', amount: '₹45,000', status: 'Delivered' },
  { id: 'o2', customerId: '1', date: '2023-08-15', amount: '₹1,50,000', status: 'Delivered' },
];

const mockTickets: CustomerTicket[] = [
  { id: 't1', customerId: '1', date: '2023-10-10', subject: 'Installation delay', status: 'Open' },
  { id: 't2', customerId: '1', date: '2023-08-20', subject: 'Product inquiry', status: 'Closed' },
];

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined);

export const CustomerDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    const saved = localStorage.getItem('mock_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCustomers;
      }
    }
    return initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem('mock_customers', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (data: Omit<CustomerRecord, 'id' | 'health' | 'ltv' | 'orders' | 'openTickets' | 'closedTickets' | 'avgCsat' | 'lastInteractionDate' | 'color' | 'initials'>) => {
    // TEMPORARY FRONTEND MOCK VALIDATION
    // BACKEND VALIDATION WILL BE ENABLED LATER
    
    if (customers.some(c => c.mobile === data.mobile)) {
      return { success: false, error: 'Mobile Number already exists' };
    }

    if (data.email && customers.some(c => c.email && c.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email already exists' };
    }

    if (data.dealerCode && customers.some(c => c.dealerCode && c.dealerCode.toLowerCase() === data.dealerCode.toLowerCase())) {
      return { success: false, error: 'Dealer Code already exists' };
    }

    const newCustomer: CustomerRecord = {
      ...data,
      id: Date.now().toString(),
      health: 'Active',
      ltv: '₹0',
      orders: 0,
      openTickets: 0,
      closedTickets: 0,
      avgCsat: 'N/A',
      lastInteractionDate: new Date().toISOString().split('T')[0],
      color: getRandomColor(),
      initials: generateInitials(data.name)
    };

    setCustomers(prev => [newCustomer, ...prev]);
    return { success: true };
  };

  const updateCustomer = (id: string, data: Partial<CustomerRecord>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data, initials: data.name ? generateInitials(data.name) : c.initials } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const getOrdersForCustomer = (customerId: string) => mockOrders.filter(o => o.customerId === customerId);
  const getTicketsForCustomer = (customerId: string) => mockTickets.filter(t => t.customerId === customerId);

  return (
    <CustomerDataContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer, getOrdersForCustomer, getTicketsForCustomer }}>
      {children}
    </CustomerDataContext.Provider>
  );
};

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);
  if (!context) throw new Error('useCustomerData must be used within CustomerDataProvider');
  return context;
};
