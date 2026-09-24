import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';

export type CustomerHealth = 'Active' | 'Inactive';
export type CustomerType = 'Customer' | 'Dealer' | 'Distributor' | 'Carpenter' | 'Influencer';

export interface CustomerRecord {
  id: string;
  type: CustomerType;
  name: string;
  contactPerson?: string;
  mobile: string;
  email: string;
  gstNumber?: string;
  associatedDealer?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
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
  locations?: any[];
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
  addCustomer: (customer: Omit<CustomerRecord, 'id' | 'health' | 'ltv' | 'orders' | 'openTickets' | 'closedTickets' | 'avgCsat' | 'lastInteractionDate' | 'color' | 'initials'>) => Promise<{ success: boolean; error?: string; data?: any }>;
  updateCustomer: (id: string, customer: Partial<CustomerRecord>) => void;
  deleteCustomer: (id: string) => void;
  getOrdersForCustomer: (customerId: string) => CustomerOrder[];
  getTicketsForCustomer: (customerId: string) => CustomerTicket[];
  fetchDealers: () => Promise<any[]>;
  fetchCustomers: () => Promise<any[]>;
  addDealerLocations: (cid: string, locations: any[]) => Promise<{ success: boolean; error?: string }>;
  updateDealerLocation: (locationId: string, locationData: any) => Promise<{ success: boolean; error?: string }>;
  deleteDealerLocation: (locationId: string) => Promise<{ success: boolean; error?: string }>;
  fetchCountries: () => Promise<{ code: string; name: string }[]>;
  fetchStates: (countryCode: string) => Promise<{ code: string; name: string }[]>;
}

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      cid
      customerCode
      mobileNumber
      email
      customerType
      locations {
        locationId
        locationName
        addressLine
        pincode
        contactPersonName
        mobileNumber
        email
        country
        state
        city
      }
    }
  }
`;

const ADD_DEALER_LOCATIONS = gql`
  mutation AddDealerLocations($cid: String!, $locations: [CreateLocationInput!]!) {
    addDealerLocations(cid: $cid, locations: $locations) {
      cid
      locations {
        locationId
        locationName
        addressLine
        pincode
        contactPersonName
        mobileNumber
        email
        country
        state
        city
      }
    }
  }
`;

const DELETE_DEALER_LOCATION = gql`
  mutation DeleteDealerLocation($locationId: String!) {
    deleteDealerLocation(locationId: $locationId)
  }
`;

const GET_COUNTRIES = gql`
  query GetCountries {
    getCountries {
      code
      name
    }
  }
`;

const GET_STATES = gql`
  query GetStates($countryCode: String!) {
    getStates(countryCode: $countryCode) {
      code
      name
    }
  }
`;

const GET_DEALERS = gql`
  query GetDealers {
    getDealers {
      cid
      customerCode
      mobileNumber
      email
      customerType
      locations {
        locationId
        locationName
        addressLine
        pincode
        contactPersonName
        mobileNumber
        email
        country
        state
        city
      }
    }
  }
`;

const GET_CUSTOMERS = gql`
  query GetCustomers {
    getCustomers {
      cid
      customerCode
      mobileNumber
      email
      customerType
      locations {
        locationId
        locationName
        addressLine
        pincode
        contactPersonName
        mobileNumber
        email
        country
        state
        city
      }
    }
  }
`;

const generateInitials = (name?: string) => {
  if (!name) return '??';
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
  { id: '4', type: 'Customer', name: 'Faisal A.', mobile: '9876543213', email: 'faisal@example.com', address: 'Main Bazar', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', source: 'WhatsApp', segment: 'Retail', region: 'South', potential: 'Low', notes: 'Price sensitive.', health: 'Active', ltv: '₹86K', orders: 2, openTickets: 1, closedTickets: 0, avgCsat: '3.2', lastInteractionDate: '2023-09-15', color: '#f59e0b', initials: 'FA' },
  { id: '5', type: 'Customer', name: 'GreenNext Villas', mobile: '9876543214', email: 'greennext@example.com', address: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', source: 'Campaign', segment: 'B2B', region: 'South', potential: 'Medium', notes: '', health: 'Active', ltv: '₹41.9L', orders: 9, openTickets: 0, closedTickets: 8, avgCsat: '4.7', lastInteractionDate: '2023-10-08', color: '#10b981', initials: 'GV' },
  { id: '6', type: 'Customer', name: 'Priyanka T.', mobile: '9876543215', email: 'priyanka@example.com', address: 'MG Road', city: 'Kochi', state: 'Kerala', pincode: '682011', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium', notes: '', health: 'Active', ltv: '₹1.12L', orders: 3, openTickets: 2, closedTickets: 1, avgCsat: '3.5', lastInteractionDate: '2023-08-20', color: '#64748b', initials: 'PT' },
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
        const parsed: any = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Migrate legacy statuses and remove invalid items
          return parsed.filter(c => c && typeof c === 'object').map((c: any) => {
            if (c.health !== 'Active' && c.health !== 'Inactive') {
              return { ...c, health: 'Active' };
            }
            return c;
          });
        }
      } catch {
        // parsing failed, fall through to default
      }
    }
    return initialCustomers;
  });

  const apolloCoreClient = useApolloCoreClient();

  useEffect(() => {
    localStorage.setItem('mock_customers', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = async (data: Omit<CustomerRecord, 'id' | 'health' | 'ltv' | 'orders' | 'openTickets' | 'closedTickets' | 'avgCsat' | 'lastInteractionDate' | 'color' | 'initials'>) => {
    if (customers.some(c => c.mobile === data.mobile)) {
      return { success: false, error: 'Mobile Number already exists' };
    }

    if (data.email && customers.some(c => c.email && c.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email already exists' };
    }

    if (data.dealerCode && customers.some(c => c.dealerCode && c.dealerCode.toLowerCase() === data.dealerCode.toLowerCase())) {
      return { success: false, error: 'Dealer Code already exists' };
    }

    let createdDealerData = null;
    try {
      const response = await apolloCoreClient.mutate({
        mutation: CREATE_CUSTOMER,
        variables: {
          input: {
            customerCode: data.name,
            mobileNumber: data.mobile,
            email: data.email || null,
            customerType: data.type,
            locationName: data.city,
            addressLine: data.address,
            pincode: data.pincode,
            city: data.city,
            state: data.state,
            country: data.country,
            locations: data.locations && data.locations.length > 0 ? data.locations.map((l: any) => ({
              locationName: l.locationName || l.city || 'Branch Office',
              addressLine: l.addressLine || '',
              pincode: l.pincode || null,
              contactPersonName: l.contactPerson || data.name,
              mobileNumber: l.mobileNumber || data.mobile,
              email: l.email || null,
              country: l.country,
              state: l.state,
              city: l.city
            })) : [{
              locationName: data.city || 'Primary Address',
              addressLine: data.address || '',
              pincode: data.pincode || null,
              contactPersonName: data.contactPerson || data.name,
              mobileNumber: data.mobile,
              email: data.email || null,
              country: data.country,
              state: data.state,
              city: data.city
            }]
          }
        }
      });
      createdDealerData = response.data?.createCustomer;
    } catch (err: any) {
      console.error('Failed to save to backend:', err);
      return { success: false, error: err.message || 'Failed to save customer to database' };
    }

    const newCustomer: CustomerRecord = {
      ...data,
      id: createdDealerData?.cid || Date.now().toString(),
      cid: createdDealerData?.cid || '',
      health: (data as any).health || 'Active',
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
    return { success: true, data: createdDealerData };
  };

  const deleteDealerLocation = async (locationId: string) => {
    try {
      await apolloCoreClient.mutate({
        mutation: DELETE_DEALER_LOCATION,
        variables: { locationId }
      });
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete location:', err);
      return { success: false, error: err.message || 'Failed to delete location' };
    }
  };

  const updateDealerLocation = async (locationId: string, locationData: any) => {
    try {
      await apolloCoreClient.mutate({
        mutation: gql`
          mutation UpdateDealerLocation($locationId: String!, $input: CreateLocationInput!) {
            updateDealerLocation(locationId: $locationId, input: $input)
          }
        `,
        variables: {
          locationId,
          input: {
            locationName: locationData.locationName || locationData.city || 'Branch Office',
            addressLine: locationData.addressLine || '',
            pincode: locationData.pincode || null,
            contactPersonName: locationData.contactPerson,
            mobileNumber: locationData.mobileNumber,
            email: locationData.email || null,
            country: locationData.country,
            state: locationData.state,
            city: locationData.city
          }
        }
      });
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update location:', err);
      return { success: false, error: err.message || 'Failed to update location' };
    }
  };

  const addDealerLocations = async (cid: string, locations: any[]) => {
    try {
      const processedLocations = locations.map(l => ({
        locationName: l.locationName || l.city || 'Branch Office',
        addressLine: l.addressLine || '',
        pincode: l.pincode || null,
        contactPersonName: l.contactPerson,
        mobileNumber: l.mobileNumber,
        email: l.email || null,
        country: l.country,
        state: l.state,
        city: l.city
      }));
      await apolloCoreClient.mutate({
        mutation: ADD_DEALER_LOCATIONS,
        variables: {
          cid,
          locations: processedLocations
        }
      });
      return { success: true };
    } catch (err: any) {
      console.error('Failed to add locations:', err);
      return { success: false, error: err.message || 'Failed to add locations' };
    }
  };

  const updateCustomer = (id: string, data: Partial<CustomerRecord>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data, initials: data.name ? generateInitials(data.name) : c.initials } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const getOrdersForCustomer = (customerId: string) => mockOrders.filter(o => o.customerId === customerId);
  const getTicketsForCustomer = (customerId: string) => mockTickets.filter(t => t.customerId === customerId);

  const fetchDealers = async () => {
    try {
      const { data } = await apolloCoreClient.query({
        query: GET_DEALERS,
        fetchPolicy: 'network-only'
      });
      console.log('[Dealer Debug] API response:', data);
      const dealers = data?.getDealers || [];
      console.log('[Dealer Debug] dealers array length:', dealers?.length);
      return dealers;
    } catch (err) {
      console.error('[Dealer Debug] Failed to fetch dealers:', err);
      return [];
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await apolloCoreClient.query({
        query: GET_CUSTOMERS,
        fetchPolicy: 'network-only'
      });
      return data?.getCustomers || [];
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      return [];
    }
  };

  const fetchCountries = async () => {
    try {
      const { data } = await apolloCoreClient.query({ query: GET_COUNTRIES, fetchPolicy: 'cache-first' });
      return data?.getCountries || [];
    } catch {
      return [];
    }
  };

  const fetchStates = async (countryCode: string) => {
    if (!countryCode) return [];
    try {
      const { data } = await apolloCoreClient.query({ query: GET_STATES, variables: { countryCode }, fetchPolicy: 'cache-first' });
      return data?.getStates || [];
    } catch {
      return [];
    }
  };

  return (
    <CustomerDataContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer, getOrdersForCustomer, getTicketsForCustomer, fetchDealers, fetchCustomers, addDealerLocations, updateDealerLocation, deleteDealerLocation, fetchCountries, fetchStates }}>
      {children}
    </CustomerDataContext.Provider>
  );
};

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);
  if (!context) throw new Error('useCustomerData must be used within CustomerDataProvider');
  return context;
};
