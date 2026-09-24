import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCustomerData, CustomerRecord } from './context/CustomerDataContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { IconMenu2, IconEye, IconPencil, IconTrash, IconUsers, IconBuildingStore, IconTool, IconUserCheck } from '@tabler/icons-react';

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
  align-items: flex-start;
  padding: 12px 16px 12px;
  background-color: transparent;
  border-bottom: none;
  
  @media (max-width: 767px) {
    padding: 8px 12px;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
  margin-left: 16px;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.secondary};
  padding: 4px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 14px;
`;

const SearchInput = styled.input`
  padding: 6px 12px 6px 32px;
  border-radius: 20px;
  border: 1px solid ${themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  outline: none;
  background: white;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #2563EB;
  }
  
  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const FilterPill = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#2563EB' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#64748B')};
  border: 1px solid ${({ active }) => (active ? '#2563EB' : '#E2E8F0')};
  border-radius: 20px;
  padding: 0 12px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? '#1D4ED8' : '#F8FAFC')};
  }
`;

const ActionButton = styled.button<{ variant?: 'blue' | 'gray' | 'red' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  height: 26px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  border: 1px solid ${({ variant }) => 
    variant === 'blue' ? '#BFDBFE' : 
    variant === 'red' ? '#FECACA' : '#E2E8F0'};
  color: ${({ variant }) => 
    variant === 'blue' ? '#2563EB' : 
    variant === 'red' ? '#EF4444' : '#64748B'};
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: ${({ variant }) => 
      variant === 'blue' ? '#EFF6FF' : 
      variant === 'red' ? '#FEF2F2' : '#F8FAFC'};
  }
`;

const GlobalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
  
  @media (max-width: 767px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    width: 100%;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
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
  background-color: #2563EB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${themeCssVariables.font.color.primary};
`;

const ChevronDown = styled.span`
  font-size: 12px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 16px 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 767px) {
    flex-direction: column;
    padding: 12px 16px;
    gap: 12px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #0F172A;
  padding: 4px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

const MobileSidebarOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileSidebarDrawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 10000;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  padding: 16px;
  overflow-y: auto;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #0F172A;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;
`;

const CountBadge = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #0F172A;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  margin-top: 2px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 767px) {
    width: 100%;
  }
`;

const NewCustomerButton = styled.button`
  background: #2563EB;
  color: white;
  border-radius: 6px;
  padding: 0 12px;
  height: 32px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
    height: 36px;
  }
  
  &:hover {
    background: #1D4ED8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean; small?: boolean }>`
  padding: ${({ small }) => (small ? '4px 8px' : '0 12px')};
  height: ${({ small }) => (small ? '24px' : '32px')};
  border-radius: 6px;
  font-size: ${({ small }) => (small ? '11px' : '12px')};
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ primary, danger }) => (primary || danger ? 'transparent' : themeCssVariables.border.color.medium)};
  background-color: ${({ primary, danger }) => (primary ? '#2563eb' : danger ? '#ef4444' : 'white')};
  color: ${({ primary, danger }) => (primary ? 'white' : danger ? 'white' : themeCssVariables.font.color.primary)};
  box-shadow: ${({ primary }) => (primary ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)')};
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 16px;
  flex: 1;
  overflow-y: auto;
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
`;

const KpiHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div<{ color: string; bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const KpiValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
`;

const KpiLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  font-family: 'Inter', sans-serif;
`;

const KpiTrend = styled.div<{ color?: string }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ color }) => color || '#10b981'};
`;

const MasterSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const MasterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
`;

const TableContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${themeCssVariables.background.secondary};
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

const MobileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileCardLabel = styled.div`
  font-size: 11px;
  color: #64748B;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 2px;
`;

const MobileCardValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
`;

const Table = styled.table`
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  min-width: 800px;

  tbody tr {
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #f8fafc;
    }
  }
`;

const Th = styled.th`
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  padding: 8px 16px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 10;
`;

const Td = styled.td`
  padding: 8px 16px;
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
  width: 22px;
  height: 22px;
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
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type }) => (type === 'Customer' ? '#dcfce7' : type === 'Dealer' ? '#f3e8ff' : '#ffedd5')};
  color: ${({ type }) => (type === 'Customer' ? '#166534' : type === 'Dealer' ? '#7e22ce' : '#9a3412')};
`;

const HealthTag = styled.span<{ type: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ type }) => (type === 'Active' ? '#dcfce7' : '#f3f4f6')};
  color: ${({ type }) => (type === 'Active' ? '#166534' : '#4b5563')};
`;

const OpenTicketsText = styled.span<{ count: number }>`
  color: ${({ count }) => (count > 0 ? '#ef4444' : themeCssVariables.font.color.secondary)};
  font-weight: ${({ count }) => (count > 0 ? '600' : '400')};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  width: 75%;
  max-width: 900px;
  background: white;
  height: 85%;
  max-height: 800px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleUp 0.2s ease;

  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalFooter = styled.div`
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
  font-size: 14px;
  font-weight: 500;
  color: ${themeCssVariables.font.color.secondary};
`;

const Input = styled.input<{ $isError?: boolean }>`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${({ $isError }) => $isError ? '#ef4444' : themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: ${({ $isError }) => $isError ? '#ef4444' : themeCssVariables.color.blue};
  }
`;



const Select = styled.select<{ $isError?: boolean }>`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${({ $isError }) => $isError ? '#ef4444' : themeCssVariables.border.color.medium};
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  outline: none;

  &:focus {
    border-color: ${({ $isError }) => $isError ? '#ef4444' : themeCssVariables.color.blue};
  }
`;

const SearchableSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchableDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SearchableOption = styled.div`
  padding: 10px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: ${themeCssVariables.background.secondary};
  }
`;

const AddressGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AddressColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddressHeader = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AddressValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
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

const Toast = styled.div<{ isError?: boolean }>`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ isError }) => isError ? '#EF4444' : '#10b981'};
  color: white;
  padding: 10px 16px;
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

const locationSchema = z.object({
  id: z.string().optional(),
  locationId: z.string().optional(),
  locationName: z.string().optional().default(""),
  contactPerson: z.string().optional().default(""),
  mobileNumber: z.string().optional().default(""),
  email: z.string().optional().default(""),
  addressLine: z.string().optional().default(""),
  addressLine2: z.string().optional().default(""),
  landmark: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default("India"),
  pincode: z.string().optional().default("")
});

const customerSchema = z.object({
  type: z.enum(['Customer', 'Dealer', 'Carpenter']),
  name: z.string().optional().default(""),
  contactPerson: z.string().optional().default(""),
  mobile: z.string().optional().default(""),
  email: z.string().optional().default(""),
  gstNumber: z.string().optional().default(""),
  associatedDealer: z.string().optional().default(""),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default("India"),
  pincode: z.string().optional().default(""),
  source: z.string().optional().default(""),
  segment: z.string().optional().default(""),
  region: z.string().optional().default(""),
  potential: z.string().optional().default(""),
  status: z.string().optional().default("Active"),
  locations: z.array(locationSchema).optional()
}).superRefine((data, ctx) => {
  if (!data.name?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["name"] });
  }

  if (data.type === 'Dealer' && !data.contactPerson?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Contact Person is required", path: ["contactPerson"] });
  }

  if (!data.mobile?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mobile Number is required", path: ["mobile"] });
  } else if (!/^[0-9]+$/.test(data.mobile.trim())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid mobile number", path: ["mobile"] });
  }

  if (data.email && data.email.trim() !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid email", path: ["email"] });
    }
  }

  if (data.locations && data.locations.length > 0) {
    data.locations.forEach((loc, index) => {
      if (!loc.addressLine?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address Line 1 is required", path: ["locations", index, "addressLine"] });
      if (!loc.state?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["locations", index, "state"] });
      if (!loc.city?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["locations", index, "city"] });
      if (!loc.country?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Country is required", path: ["locations", index, "country"] });
      if (!loc.pincode?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pincode is required", path: ["locations", index, "pincode"] });
      } else if (loc.country === 'India' && !/^[0-9]{6}$/.test(loc.pincode.trim())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid Indian pincode", path: ["locations", index, "pincode"] });
      }
    });
  } else {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one address is required", path: ["locations"] });
  }
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type LocationFormValues = z.infer<typeof locationSchema>;

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, fetchDealers, fetchCustomers, addDealerLocations, updateDealerLocation, deleteDealerLocation, fetchCountries, fetchStates } = useCustomerData();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<{ text: string, isError?: boolean } | null>(null);
  const [dealersList, setDealersList] = useState<any[]>([]);
  const [isAddingNewDealer, setIsAddingNewDealer] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [dealerSearchText, setDealerSearchText] = useState('');

  const [countries, setCountries] = useState<{code: string, name: string}[]>([]);
  const [statesList, setStatesList] = useState<{code: string, name: string}[]>([]);
  const [locationStates, setLocationStates] = useState<Record<number, {code: string, name: string}[]>>({});
  const [deleteModalState, setDeleteModalState] = useState<{ id: string, name: string, type: string, isDeleting?: boolean } | null>(null);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);


  const [expandedAddresses, setExpandedAddresses] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typeFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
        setIsTypeFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAddressExpansion = (idx: number) => {
    setExpandedAddresses(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const { register, handleSubmit, reset, watch, setValue, getValues, control, formState: { errors } } = useForm<any>({
    mode: 'onChange',
    resolver: zodResolver(customerSchema),
    defaultValues: {
      type: 'Customer', name: '', contactPerson: '', mobile: '', email: '', gstNumber: '', associatedDealer: '', address: '', city: '', state: '', country: 'India', pincode: '', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium', status: 'Active', locations: []
    }
  });

  const watchType = watch('type');
  const watchCountry = watch('country');
  
  useEffect(() => {
    if (watchType === 'Customer' || watchType === 'Carpenter') {
      const currentLocations = getValues('locations') || [];
      if (currentLocations.length > 1) {
        setValue('locations', [currentLocations[0]]);
      }
    }
    if (watchType === 'Customer') {
      setValue('contactPerson', '');
      setValue('gstNumber', '');
      setValue('associatedDealer', '');
    } else if (watchType === 'Carpenter') {
      setValue('contactPerson', '');
      setValue('gstNumber', '');
    } else if (watchType === 'Dealer') {
      setValue('associatedDealer', '');
    }
  }, [watchType, setValue, getValues]);

  useEffect(() => {
    if (watchCountry) {
      const c = countries.find(x => x.name === watchCountry || x.code === watchCountry);
      if (c) fetchStates(c.code).then(setStatesList);
      else setStatesList([]);
    } else {
      setStatesList([]);
    }
  }, [watchCountry, countries]);


  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: 'locations'
  });
  const [deleteAddressModalState, setDeleteAddressModalState] = useState<{ id: string | null, index: number, isDeleting?: boolean } | null>(null);

  const handleDeleteExistingAddress = (addressId: string, index: number) => {
    setDeleteAddressModalState({ id: addressId || null, index });
  };

  const confirmDeleteAddress = async () => {
    if (!deleteAddressModalState) return;
    setDeleteAddressModalState(prev => prev ? { ...prev, isDeleting: true } : null);

    const { id, index } = deleteAddressModalState;
    if (id) {
      const res = await deleteDealerLocation(id);
      if (res.success) {
        showToast('Address removed successfully.');
        setDealersList(prev => prev.map(d => {
          if (d.cid === selectedDealerId) {
            return { ...d, locations: d.locations.filter((l: any) => l.locationId !== id) };
          }
          return d;
        }));
      } else {
        setSubmitError(res.error || 'Failed to remove address');
        setDeleteAddressModalState(prev => prev ? { ...prev, isDeleting: false } : null);
        return;
      }
    }
    removeLocation(index);
    setDeleteAddressModalState(null);
  };
  
  useEffect(() => {
    if (watchType === 'Dealer') {
      fetchDealers().then(data => {
        console.log('[Dealer Debug] API response inside CustomersPage:', data);
        setDealersList(data);
      });
    }
  }, [watchType]);

  const filteredDealers = useMemo(() => {
    return dealersList.filter(d => {
      if (!dealerSearchText) return true;
      if (!d.customerCode) return false;
      return d.customerCode.toLowerCase().includes(dealerSearchText.toLowerCase());
    });
  }, [dealersList, dealerSearchText]);

  useEffect(() => {
    console.log('[Dealer Debug] dealers array length:', dealersList?.length);
    console.log('[Dealer Debug] filtered dealers length:', filteredDealers?.length);
    console.log('[Dealer Debug] search text:', dealerSearchText);
    console.log('[Dealer Debug] selected customer type:', watchType);
  }, [dealersList?.length, filteredDealers?.length, dealerSearchText, watchType]);

  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [isDealerAccordionOpen, setIsDealerAccordionOpen] = useState(true);

  const handleDealerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedDealerId(selectedId === 'ADD_NEW' ? null : selectedId);
    
    if (selectedId === 'ADD_NEW') {
      setIsAddingNewDealer(true);
      setValue('name', '');
      setValue('mobile', '');
      setValue('email', '');
      setValue('address', '');
      setValue('city', '');
      setValue('pincode', '');
      if ((getValues('locations') || []).length === 0) {
        setValue('locations', [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }]);
      }
    } else if (selectedId) {
      setIsAddingNewDealer(false);
      const dealer = dealersList.find(d => d.cid === selectedId);
      if (dealer) {
        setValue('name', dealer.customerCode);
        setValue('mobile', dealer.mobileNumber);
        setValue('email', dealer.email || '');
        const loc = dealer.locations?.[0];
        if (loc) {
          setValue('city', loc.city || loc.locationName || '');
          setValue('address', loc.addressLine || '');
          setValue('pincode', loc.pincode || '');
          setValue('contactPerson', loc.contactPerson || '');
        }
      if ((getValues('locations') || []).length === 0) {
          setValue('locations', [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }]);
          fetchCountries().then(allCountries => {
            const c = allCountries.find(x => x.name === 'India' || x.code === 'India' || x.code === 'IN');
            if (c) fetchStates(c.code).then(st => setLocationStates(prev => ({ ...prev, 0: st })));
          });
        }
      }
    }
  };

  const filteredCustomers = useMemo(() => {
    let result = customers;
    
    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter);
    }
    
    if (!searchQuery) return result;
    
    const lowerQ = searchQuery.toLowerCase();
    return result.filter(c => 
      (c.name || '').toLowerCase().includes(lowerQ) ||
      (c.mobile || '').includes(lowerQ) ||
      (c.email && c.email.toLowerCase().includes(lowerQ)) ||
      (c.city || '').toLowerCase().includes(lowerQ) ||
      (c.dealerCode && c.dealerCode.toLowerCase().includes(lowerQ))
    );
  }, [customers, searchQuery, typeFilter]);

  const kpis = useMemo(() => {
    const total = customers.length;
    const dealers = customers.filter(c => c.type === 'Dealer').length;
    const carpenters = customers.filter(c => c.type === 'Carpenter').length;
    const active = customers.filter(c => c.health === 'Active').length;

    return [
      { icon: <IconUsers />, iconColor: '#2563EB', iconBg: '#EFF6FF', value: String(total), label: 'Total Customers', trend: '▲ 214 this month', trendColor: '#10b981' },
      { icon: <IconBuildingStore />, iconColor: '#9333EA', iconBg: '#F3E8FF', value: String(dealers), label: 'Dealers', trend: '▲ 12 this month', trendColor: '#10b981' },
      { icon: <IconTool />, iconColor: '#EA580C', iconBg: '#FFEDD5', value: String(carpenters), label: 'Carpenters', trend: '▲ 8 this month', trendColor: '#10b981' },
      { icon: <IconUserCheck />, iconColor: '#16A34A', iconBg: '#DCFCE7', value: String(active), label: 'Active Customers', trend: '▲ 83% of total', trendColor: '#10b981' },
    ];
  }, [customers]);

  const showToast = (msg: string, isError?: boolean) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openDrawer = async (customer?: CustomerRecord) => {
    setSubmitError('');
    if (customer) {
      setEditingCustomer(customer);
      let customerLocations = customer.locations || [];
      let fetchedCustomer = customer;
      
      if (customer.type === 'Dealer') {
        const dealers = await fetchDealers();
        const dealerData = dealers.find(d => d.cid === customer.id || d.customerCode === customer.name);
        if (dealerData && dealerData.locations && dealerData.locations.length > 0) {
           customerLocations = dealerData.locations.map((l: any) => ({
             locationId: l.locationId,
             id: l.locationId,
             locationName: l.locationName || '',
             contactPerson: l.contactPersonName || '',
             mobileNumber: l.mobileNumber || '',
             email: l.email || '',
             addressLine: l.addressLine || '',
             addressLine2: l.addressLine2 || '',
             landmark: l.landmark || '',
             city: l.city || '',
             state: l.state || '',
             country: l.country || 'India',
             pincode: l.pincode || ''
           }));
        } else {
           customerLocations = [{ locationId: '', locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }];
        }
      } else if (customer.type === 'Customer') {
        const customersData = await fetchCustomers();
        const customerData = customersData.find(c => c.cid === customer.id || c.customerCode === customer.name);
        if (customerData && customerData.locations && customerData.locations.length > 0) {
           customerLocations = customerData.locations.map((l: any) => ({
             locationId: l.locationId,
             id: l.locationId,
             locationName: l.locationName || '',
             contactPerson: l.contactPersonName || '',
             mobileNumber: l.mobileNumber || '',
             email: l.email || '',
             addressLine: l.addressLine || '',
             addressLine2: l.addressLine2 || '',
             landmark: l.landmark || '',
             city: l.city || '',
             state: l.state || '',
             country: l.country || 'India',
             pincode: l.pincode || ''
           }));
        } else {
           customerLocations = [{ locationId: '', locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }];
        }
      }

      reset({
        type: fetchedCustomer.type, 
        name: fetchedCustomer.name, 
        contactPerson: fetchedCustomer.contactPerson || '', 
        mobile: fetchedCustomer.mobile, 
        email: fetchedCustomer.email, 
        gstNumber: (fetchedCustomer as any).gstNumber || '', 
        associatedDealer: (fetchedCustomer as any).associatedDealer || '', 
        address: fetchedCustomer.address, 
        city: fetchedCustomer.city, 
        state: fetchedCustomer.state, 
        country: fetchedCustomer.country || 'India', 
        pincode: fetchedCustomer.pincode, 
        source: fetchedCustomer.source || 'Website', 
        segment: fetchedCustomer.segment || 'Retail', 
        region: fetchedCustomer.region || 'South', 
        potential: fetchedCustomer.potential || 'Medium', 
        status: fetchedCustomer.health || 'Active', 
        locations: customerLocations
      });
      
      if (customer.type === 'Dealer' && customer.id) {
        setSelectedDealerId(customer.id);
      } else {
        setSelectedDealerId(null);
      }
      
      // Prefetch states for all loaded locations
      if (customerLocations && customerLocations.length > 0) {
        customerLocations.forEach((loc: any, index: number) => {
          const countryVal = loc.country || 'India';
          // we need to resolve it against the countries array
          fetchCountries().then(allCountries => {
            const c = allCountries.find(x => x.name === countryVal || x.code === countryVal);
            if (c) {
              fetchStates(c.code).then(st => {
                setLocationStates(prev => ({ ...prev, [index]: st }));
              });
            }
          });
        });
      }
      
    } else {
      setEditingCustomer(null);
      setSelectedDealerId(null);
      setLocationStates({}); // Reset location states
      reset({
        type: 'Customer', name: '', contactPerson: '', mobile: '', email: '', gstNumber: '', associatedDealer: '', address: '', city: '', state: '', country: 'India', pincode: '', source: 'Website', segment: 'Retail', region: 'South', potential: 'Medium', status: 'Active', locations: [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }]
      });
      // Prefetch default India for index 0
      fetchCountries().then(allCountries => {
        const c = allCountries.find(x => x.name === 'India' || x.code === 'India' || x.code === 'IN');
        if (c) {
          fetchStates(c.code).then(st => {
            setLocationStates({ 0: st });
          });
        }
      });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onSubmit = async (data: any) => {
    setSubmitError('');
    
    if (data.type === 'Dealer') {
      if (!isAddingNewDealer && !selectedDealerId) {
        setSubmitError('Please select a dealer or add a new one.');
        return;
      }
      if (!selectedDealerId && !editingCustomer) {
        const isDuplicate = dealersList.some(d => (d.customerCode || '').toLowerCase() === (data.name || '').toLowerCase());
        if (isDuplicate) {
          setSubmitError('A dealer with this name already exists.');
          return;
        }
      }
    }
    
    if (editingCustomer) {
      // Find deleted locations
      const originalLocationIds = (editingCustomer?.locations || []).map((l: any) => l.locationId);
      const newLocationIds = data.locations?.map((l: any) => l.locationId).filter(Boolean) || [];
      const deletedLocationIds = originalLocationIds.filter((id: string) => !newLocationIds.includes(id));

      // Delete removed locations
      for (const id of deletedLocationIds) {
        await deleteDealerLocation(id);
      }

      // Update existing locations
      for (const loc of data.locations || []) {
        if (loc.locationId) {
          await updateDealerLocation(loc.locationId, loc);
        }
      }

      // Add new locations
      const newLocations = data.locations?.filter((l: any) => !l.locationId) || [];
      if (newLocations.length > 0) {
        const res = await addDealerLocations(editingCustomer.id, newLocations);
        if (!res.success) {
          setSubmitError(res.error || 'Failed to save new locations');
          return;
        }
      }

      const { country, status, ...rest } = data;
      const dbData = { ...rest, country, health: status, dealerCode: '', notes: '' } as any;
      updateCustomer(editingCustomer.id, dbData);
      
      if (data.type === 'Dealer') {
        fetchDealers().then(data => setDealersList(data));
      } else {
        fetchCustomers();
      }
      
      closeDrawer();
      showToast(`${data.type === 'Dealer' ? 'Dealer' : 'Customer'} updated successfully`);
    } else {
      const { country, status, ...rest } = data;
      const dbData = { ...rest, country, health: status, dealerCode: '', notes: '' } as any;
      const res = await addCustomer(dbData);
      if (res.success) {
        if (data.type === 'Dealer' && isAddingNewDealer) {
          fetchDealers().then(data => setDealersList(data));
          setSelectedDealerId(res.data?.cid || res.data?.id || null);
          setIsAddingNewDealer(false);
          showToast('Dealer created successfully. You can now add locations.');
          return;
        } else if (data.type === 'Dealer') {
          fetchDealers().then(data => setDealersList(data));
        }
        closeDrawer();
        showToast(`${data.type === 'Dealer' ? 'Dealer' : 'Customer'} created successfully`);
      } else {
        setSubmitError(res.error || `Failed to create ${data.type}`);
      }
    }
  };

  const handleDelete = (id: string, name: string, type: string) => {
    setDeleteModalState({ id, name, type });
  };

  const confirmDelete = async () => {
    if (!deleteModalState) return;
    
    setDeleteModalState(prev => prev ? { ...prev, isDeleting: true } : null);
    
    try {
      // Simulate API call if needed, otherwise it's just sync for now
      deleteCustomer(deleteModalState.id);
      showToast(`${deleteModalState.type === 'Dealer' ? 'Dealer' : 'Customer'} deleted successfully`);
      setDeleteModalState(null);
    } catch (error) {
      showToast(`Failed to delete ${deleteModalState.type === 'Dealer' ? 'dealer' : 'customer'}. Please try again.`, true);
      setDeleteModalState(prev => prev ? { ...prev, isDeleting: false } : null);
    }
  };

  return (
    <>
      <PageTitle title="Customers" />
      <PageWrapper>
        <TopGlobalBar>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <MobileMenuButton onClick={() => setIsMobileDrawerOpen(true)}>
              <IconMenu2 size={20} />
            </MobileMenuButton>
            <SearchInputWrapper>
              <SearchIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></SearchIcon>
              <SearchInput 
                placeholder="Search customers, dealer, carpenter or..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>
          </div>
          <GlobalActions>
            <MobileSearchButton>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </MobileSearchButton>
            <IconButton><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></IconButton>
            <UserProfile>
              <Avatar>NL</Avatar>
              <UserInfo>
                <UserName>Nagarajan Ladera</UserName>
              </UserInfo>
              <ChevronDown>▼</ChevronDown>
            </UserProfile>
          </GlobalActions>
        </TopGlobalBar>
        
        <PageContainer>
          <PageHeader>
            <TitleSection>
              <Title>Customers</Title>
              <Subtitle>Manage customers, dealers and carpenters from a single workspace.</Subtitle>
            </TitleSection>
            <HeaderActions>
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
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: themeCssVariables.font.color.primary }}>
                    Customer master
                  </h3>
                  <Subtitle>Synced with SAP • Updated just now</Subtitle>
                </TitleSection>
                <GlobalActions>
                  <FilterPill active={typeFilter === 'All'} onClick={() => setTypeFilter('All')}>All Types</FilterPill>
                  <FilterPill active={typeFilter === 'Dealer'} onClick={() => setTypeFilter('Dealer')}>Dealer</FilterPill>
                  <FilterPill active={typeFilter === 'Customer'} onClick={() => setTypeFilter('Customer')}>Customer</FilterPill>
                  <FilterPill active={typeFilter === 'Carpenter'} onClick={() => setTypeFilter('Carpenter')}>Carpenter</FilterPill>
                </GlobalActions>
              </MasterHeader>
              
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>CUSTOMER</Th>
                      <Th>CUSTOMER TYPE</Th>
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
                        <Td colSpan={9} style={{ textAlign: 'center', padding: '32px' }}>
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
                          <Td><Tag type={c.type}>{c.type}</Tag></Td>
                          <Td>{c.city}</Td>
                          <Td><Tag type="Segment">{c.segment}</Tag></Td>
                          <Td>{c.ltv}</Td>
                          <Td>{c.orders}</Td>
                          <Td><OpenTicketsText count={c.openTickets}>{c.openTickets}</OpenTicketsText></Td>
                          <Td><HealthTag type={c.health === 'Inactive' ? 'Inactive' : 'Active'}>{c.health === 'Inactive' ? 'Inactive' : 'Active'}</HealthTag></Td>
                          <Td>
                            <ActionMenu style={{ display: 'flex', gap: '8px' }}>
                              <ActionButton variant="blue" onClick={() => navigate(`/customers/${c.id}`)}>
                                <IconEye size={16} /> View 360
                              </ActionButton>
                              <ActionButton variant="gray" style={{ padding: '0 6px' }} onClick={() => openDrawer(c)}>
                                <IconPencil size={16} />
                              </ActionButton>
                              <ActionButton variant="red" style={{ padding: '0 6px' }} onClick={() => handleDelete(c.id, c.name, c.type)}>
                                <IconTrash size={16} />
                              </ActionButton>
                            </ActionMenu>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </TableContainer>
              <MobileCardList>
                {filteredCustomers.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                    No customers found matching your criteria.
                  </div>
                ) : (
                  filteredCustomers.map(c => (
                    <MobileCard key={c.id}>
                      <MobileCardRow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <AvatarCircle color={c.color}>{c.initials}</AvatarCircle>
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.name}</span>
                        </div>
                        <Tag type={c.type || 'Customer'}>{c.type || 'Customer'}</Tag>
                      </MobileCardRow>
                      
                      <MobileCardRow style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                        <div>
                          <MobileCardLabel>Location</MobileCardLabel>
                          <MobileCardValue>{c.city}</MobileCardValue>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <MobileCardLabel>Status</MobileCardLabel>
                          <HealthTag type={c.health === 'Inactive' ? 'Inactive' : 'Active'}>{c.health === 'Inactive' ? 'Inactive' : 'Active'}</HealthTag>
                        </div>
                      </MobileCardRow>
                      
                      <ActionButton variant="blue" style={{ width: '100%', height: '36px', marginTop: '4px' }} onClick={() => navigate(`/customers/${c.id}`)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        View 360
                      </ActionButton>
                    </MobileCard>
                  ))
                )}
              </MobileCardList>
            </MasterSection>
          </Grid>
        </PageContainer>

        {isDrawerOpen && (
          <ModalOverlay onClick={closeDrawer}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <Title style={{ fontSize: '28px', fontWeight: 600 }}>{editingCustomer ? `Edit ${watchType || 'Customer'}` : `New ${watchType || 'Customer'}`}</Title>
                <div style={{ cursor: 'pointer', fontSize: '20px', color: themeCssVariables.font.color.tertiary }} onClick={closeDrawer}>&times;</div>
              </ModalHeader>
              <ModalBody>
                {submitError && <Alert>{submitError}</Alert>}
                <form id="customer-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Section 1 - Basic Information */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: themeCssVariables.font.color.primary, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${themeCssVariables.border.color.light}` }}>
                      Basic Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <FormGroup>
                        <Label>Customer Type *</Label>
                        <Select {...register('type')}>
                          <option value="Customer">Customer</option>
                          <option value="Dealer">Dealer</option>
                          <option value="Carpenter">Carpenter</option>
                        </Select>
                      </FormGroup>

                      <FormGroup>
                        <Label>{watchType === 'Dealer' ? 'Dealer Name *' : watchType === 'Carpenter' ? 'Carpenter Name *' : 'Customer Name *'}</Label>
                        <Input {...register('name')} placeholder="Enter full name" $isError={!!errors.name} />
                        {errors.name && <ErrorText>{errors.name.message as string}</ErrorText>}
                      </FormGroup>

                      {watchType === 'Dealer' && (
                        <FormGroup>
                          <Label>Contact Person Name *</Label>
                          <Input {...register('contactPerson')} placeholder="Contact person name" $isError={!!errors.contactPerson} />
                          {errors.contactPerson && <ErrorText>{errors.contactPerson.message as string}</ErrorText>}
                        </FormGroup>
                      )}

                      <FormGroup>
                        <Label>Mobile Number *</Label>
                        <Input {...register('mobile')} placeholder="Enter 10-digit number" $isError={!!errors.mobile} />
                        {errors.mobile && <ErrorText>{errors.mobile.message as string}</ErrorText>}
                      </FormGroup>

                      <FormGroup>
                        <Label>Email</Label>
                        <Input {...register('email')} placeholder="Email address" type="email" $isError={!!errors.email} />
                        {errors.email && <ErrorText>{errors.email.message as string}</ErrorText>}
                      </FormGroup>

                      {watchType === 'Dealer' && (
                        <FormGroup>
                          <Label>GST Number</Label>
                          <Input {...register('gstNumber')} placeholder="GST Number" $isError={!!errors.gstNumber} />
                          {errors.gstNumber && <ErrorText>{errors.gstNumber.message as string}</ErrorText>}
                        </FormGroup>
                      )}

                      {watchType === 'Carpenter' && (
                        <FormGroup>
                          <Label>Associated Dealer</Label>
                          <Input {...register('associatedDealer')} placeholder="Associated Dealer" $isError={!!errors.associatedDealer} />
                          {errors.associatedDealer && <ErrorText>{errors.associatedDealer.message as string}</ErrorText>}
                        </FormGroup>
                      )}
                    </div>
                  </div>

                  {/* Section 2 - Address Information */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: themeCssVariables.font.color.primary, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${themeCssVariables.border.color.light}` }}>
                      Address Information
                    </h3>
                    
                    {locationFields.map((field, index) => (
                      <div key={field.id} style={{ marginBottom: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        {locationFields.length > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                              Address {index + 1}
                            </h4>
                            <ActionButton type="button" variant="red" onClick={() => handleDeleteExistingAddress(field.locationId || '', index)} style={{ padding: '4px 8px', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid #FECACA', color: '#EF4444' }}>
                              <IconTrash size={14} /> Remove
                            </ActionButton>
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                          <FormGroup>
                            <Label>Address Line 1 *</Label>
                            <Input {...register(`locations.${index}.addressLine` as const)} placeholder="Street address, P.O. box, company name" $isError={!!errors.locations?.[index]?.addressLine} />
                            {errors.locations?.[index]?.addressLine && <ErrorText>{errors.locations?.[index]?.addressLine?.message as string}</ErrorText>}
                          </FormGroup>
                          <FormGroup>
                            <Label>Address Line 2</Label>
                            <Input {...register(`locations.${index}.addressLine2` as const)} placeholder="Apartment, suite, unit, building, floor, etc." $isError={!!errors.locations?.[index]?.addressLine2} />
                            {errors.locations?.[index]?.addressLine2 && <ErrorText>{errors.locations?.[index]?.addressLine2?.message as string}</ErrorText>}
                          </FormGroup>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                          <FormGroup>
                            <Label>Country *</Label>
                            <Select 
                              {...register(`locations.${index}.country` as const)}
                              $isError={!!errors.locations?.[index]?.country}
                              onChange={(e) => {
                                register(`locations.${index}.country` as const).onChange(e);
                                setValue(`locations.${index}.state` as const, ''); // Clear state
                                const c = e.target.value;
                                if (c) {
                                  fetchStates(c).then(st => {
                                    setLocationStates(prev => ({ ...prev, [index]: st }));
                                  });
                                } else {
                                  setLocationStates(prev => ({ ...prev, [index]: [] }));
                                }
                              }}
                            >
                              <option value="">Select Country</option>
                              {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </Select>
                            {errors.locations?.[index]?.country && <ErrorText>{errors.locations?.[index]?.country?.message as string}</ErrorText>}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label>State *</Label>
                            <Select 
                              {...register(`locations.${index}.state` as const)} 
                              $isError={!!errors.locations?.[index]?.state}
                              onChange={(e) => {
                                register(`locations.${index}.state` as const).onChange(e);
                              }}
                            >
                              <option value="">Select State</option>
                              {(locationStates[index] || []).map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                            </Select>
                            {errors.locations?.[index]?.state && <ErrorText>{errors.locations?.[index]?.state?.message as string}</ErrorText>}
                          </FormGroup>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                          <FormGroup>
                            <Label>City *</Label>
                            <Input {...register(`locations.${index}.city` as const)} placeholder="City" $isError={!!errors.locations?.[index]?.city} />
                            {errors.locations?.[index]?.city && <ErrorText>{errors.locations?.[index]?.city?.message as string}</ErrorText>}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label>Landmark</Label>
                            <Input {...register(`locations.${index}.landmark` as const)} placeholder="Landmark" $isError={!!errors.locations?.[index]?.landmark} />
                            {errors.locations?.[index]?.landmark && <ErrorText>{errors.locations?.[index]?.landmark?.message as string}</ErrorText>}
                          </FormGroup>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                          <FormGroup>
                            <Label>Pincode *</Label>
                            <Input {...register(`locations.${index}.pincode` as const)} placeholder="Pincode" $isError={!!errors.locations?.[index]?.pincode} />
                            {errors.locations?.[index]?.pincode && <ErrorText>{errors.locations?.[index]?.pincode?.message as string}</ErrorText>}
                          </FormGroup>
                        </div>
                      </div>
                    ))}

                    {watchType === 'Dealer' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button type="button" small primary onClick={() => {
                          const newIndex = locationFields.length;
                          appendLocation({ locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' });
                          fetchStates('IN').then(st => setLocationStates(prev => ({ ...prev, [newIndex]: st })));
                        }}>+ Add Another Address</Button>
                      </div>
                    )}
                  </div>

                  {/* Section 3 - Business Information */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: themeCssVariables.font.color.primary, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${themeCssVariables.border.color.light}` }}>
                      Business Information
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
                      
                      <FormGroup>
                        <Label>Region</Label>
                        <Select {...register('region')}>
                          <option value="North">North</option>
                          <option value="South">South</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>Potential</Label>
                        <Select {...register('potential')}>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </Select>
                      </FormGroup>

                      {editingCustomer && (
                        <FormGroup>
                          <Label>Status</Label>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '36px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: themeCssVariables.font.color.primary }}>
                              <input type="radio" {...register('status')} value="Active" style={{ cursor: 'pointer' }} />
                              Active
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: themeCssVariables.font.color.primary }}>
                              <input type="radio" {...register('status')} value="Inactive" style={{ cursor: 'pointer' }} />
                              Inactive
                            </label>
                          </div>
                        </FormGroup>
                      )}
                    </div>
                  </div>

                </form>
              </ModalBody>
              <ModalFooter>
                <Button type="button" onClick={() => {
                  if (isAddingNewDealer) {
                    setIsAddingNewDealer(false);
                    if (!selectedDealerId) {
                      setValue('name', '');
                      setValue('mobile', '');
                      setValue('email', '');
                      setValue('city', '');
                      setValue('address', '');
                      setValue('pincode', ''); setValue('locations', [{ locationName: '', country: 'India', state: '', city: '', addressLine: '', addressLine2: '', landmark: '', pincode: '', contactPerson: '', mobileNumber: '', email: '' }]);
                    }
                  } else {
                    closeDrawer();
                  }
                }}>Cancel</Button>
                {watchType === 'Dealer' ? (
                  editingCustomer ? (
                    <Button primary type="submit" form="customer-form">Update Dealer</Button>
                  ) : isAddingNewDealer ? (
                    <Button primary type="submit" form="customer-form">Create Dealer</Button>
                  ) : selectedDealerId ? (
                    locationFields.length > 0 ? (
                      <Button primary type="submit" form="customer-form">Save Address</Button>
                    ) : null
                  ) : (
                    <Button primary type="submit" form="customer-form">Create Dealer</Button>
                  )
                ) : (
                  <Button primary type="submit" form="customer-form">{editingCustomer ? `Update ${watchType}` : `Create ${watchType}`}</Button>
                )}
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {toastMessage && (
          <Toast isError={toastMessage.isError}>
            {toastMessage.text}
          </Toast>
        )}
        
        {deleteModalState && (
          <ModalOverlay onClick={() => !deleteModalState.isDeleting && setDeleteModalState(null)}>
            <ModalContent style={{ width: '400px', height: 'auto', maxHeight: 'none', padding: '0', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconTrash size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                  Delete {deleteModalState.type === 'Dealer' ? 'Dealer' : 'Customer'}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                  Are you sure you want to delete "{deleteModalState.name}"?<br/><br/>
                  Are you sure you want to delete this record?<br/>
                  This action cannot be undone.
                </p>
              </div>
              <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Button type="button" onClick={() => setDeleteModalState(null)} disabled={deleteModalState.isDeleting}>Cancel</Button>
                <Button danger type="button" onClick={confirmDelete} disabled={deleteModalState.isDeleting}>
                  {deleteModalState.isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
        
        {deleteAddressModalState && (
          <ModalOverlay onClick={() => !deleteAddressModalState.isDeleting && setDeleteAddressModalState(null)}>
            <ModalContent style={{ width: '400px', height: 'auto', maxHeight: 'none', padding: '0', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconTrash size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                  Delete Address
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                  Are you sure you want to remove this address?<br/>
                  This action cannot be undone.
                </p>
              </div>
              <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Button type="button" onClick={() => setDeleteAddressModalState(null)} disabled={deleteAddressModalState.isDeleting}>Cancel</Button>
                <Button danger type="button" onClick={confirmDeleteAddress} disabled={deleteAddressModalState.isDeleting}>
                  {deleteAddressModalState.isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        <MobileSidebarOverlay isOpen={isMobileDrawerOpen} onClick={() => setIsMobileDrawerOpen(false)} />
        <MobileSidebarDrawer isOpen={isMobileDrawerOpen}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1E293B' }}>Menu</h2>
            <button onClick={() => setIsMobileDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}>&times;</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div onClick={() => { navigate('/'); setIsMobileDrawerOpen(false); }} style={{ padding: '12px 0', fontSize: '15px', color: '#475569', fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid #E2E8F0' }}>Dashboard</div>
            <div onClick={() => { navigate('/customers'); setIsMobileDrawerOpen(false); }} style={{ padding: '12px 0', fontSize: '15px', color: '#2563EB', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #E2E8F0' }}>Customers</div>
            <div onClick={() => { navigate('/leads'); setIsMobileDrawerOpen(false); }} style={{ padding: '12px 0', fontSize: '15px', color: '#475569', fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid #E2E8F0' }}>Leads</div>
            <div onClick={() => { navigate('/deals'); setIsMobileDrawerOpen(false); }} style={{ padding: '12px 0', fontSize: '15px', color: '#475569', fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid #E2E8F0' }}>Deals</div>
            <div onClick={() => { navigate('/tickets'); setIsMobileDrawerOpen(false); }} style={{ padding: '12px 0', fontSize: '15px', color: '#475569', fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid #E2E8F0' }}>Tickets</div>
          </div>
        </MobileSidebarDrawer>
      </PageWrapper>
    </>
  );
};
