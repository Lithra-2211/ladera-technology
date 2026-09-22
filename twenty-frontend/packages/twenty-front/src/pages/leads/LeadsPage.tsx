import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { v4 } from 'uuid';

export interface FollowupTimelineItem {
  id: string;
  date: string;
  status: string;
  notes: string;
  createdAt: string;
  userName?: string;
  callReason?: string;
}

export interface LeadItem {
  id: string;
  leadId?: string;
  dateCaptured?: string | null;
  leadName: string;
  jobTitle?: string | null;
  companyName?: string | null;
  email?: string | null;
  leadEmail?: string | null;
  phone?: string | null;
  leadNumber: string;
  leadSource: string;
  serviceInterest?: string | null;
  industry?: string | null;
  companySize?: string | null;
  pipelineStage?: string;
  leadOwner?: string;
  estimatedDealValue?: string | null;
  probability?: number;
  expectedCloseDate?: string | null;
  lastContactDate?: string | null;
  followupNotes?: string | null;
  status: string;
  lostReason?: string | null;
  daysInPipeline?: number;

  // Compatibility & metadata fields
  isQualifiedLead?: boolean;
  nextFollowupDate?: string | null;
  followupStatus?: string | null;
  callReason?: string | null;
  yetToCallNotes?: string | null;
  followupHistory?: FollowupTimelineItem[];
  assignedSalesUser?: string;
  initials?: string;
  avatarTone?: 'violet' | 'teal' | 'amber' | 'slate' | 'brand';
  source?: string;
  requirement?: string;
  estValue?: string;
  score?: 'A' | 'B';
  stage?: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadKpis {
  totalOpenLeads: number;
  openLeadsGrowth: string;
  websitePercentage: number;
  whatsappPercentage: number;
  phonePercentage: number;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'LD-0001',
    leadId: 'LD-0001',
    dateCaptured: '2026-09-01',
    leadName: 'Kavitha M.',
    companyName: 'Aban Offshore',
    email: 'kavitha.m@gmail.com',
    leadEmail: 'kavitha.m@gmail.com',
    phone: '+91 98451 22310',
    leadNumber: '+91 98451 22310',
    leadSource: 'Website',
    serviceInterest: 'Cloud Migration',
    industry: 'Banking and Finance',
    companySize: '1-10 Employees',
    pipelineStage: 'Attempted to Contact',
    leadOwner: 'Aravind',
    estimatedDealValue: '₹68K',
    probability: 10,
    expectedCloseDate: '2026-09-30',
    lastContactDate: '2026-09-12',
    followupNotes: 'Lead received from Website. Yet to make initial outreach call.',
    status: 'New',
    lostReason: null,
    daysInPipeline: 15,
    isQualifiedLead: false,
    nextFollowupDate: '2026-09-12',
    followupStatus: 'Yet to Call',
    assignedSalesUser: 'Aravind',
    initials: 'KM',
    avatarTone: 'violet',
    source: 'Website',
    stage: 'New',
    requirement: 'Sofa set · 3+1+1',
    estValue: '₹68K',
    score: 'B',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
    followupHistory: [
      {
        id: 'FL-101',
        date: '2026-09-12',
        status: 'Yet to Call',
        notes: 'Lead received from Website. Yet to make initial outreach call.',
        createdAt: '2026-09-12T11:30:00.000Z',
        userName: 'Aravind',
      },
      {
        id: 'FL-102',
        date: '2026-09-08',
        status: 'Connected',
        notes: 'Introductory discussion on 3+1+1 living room sofa set requirements.',
        createdAt: '2026-09-08T15:00:00.000Z',
        userName: 'Aravind',
      },
      {
        id: 'FL-103',
        date: '2026-09-02',
        status: 'RNR (Ring No Response)',
        notes: 'Attempted initial outreach, call rang no response.',
        createdAt: '2026-09-02T10:15:00.000Z',
        userName: 'Aravind',
      },
    ],
  },
  {
    id: 'LD-0002',
    leadId: 'LD-0002',
    dateCaptured: '2026-09-02',
    leadName: 'Sundar Interiors',
    companyName: 'Danfoss',
    email: 'contact@sundarinteriors.in',
    leadEmail: 'contact@sundarinteriors.in',
    phone: '+91 98840 91823',
    leadNumber: '+91 98840 91823',
    leadSource: 'Partner',
    serviceInterest: 'Cyber Security Services',
    industry: 'Healthcare',
    companySize: '11-50 Employees',
    pipelineStage: 'Meeting Completed',
    leadOwner: 'Pradeep',
    estimatedDealValue: '₹4.8L',
    probability: 40,
    expectedCloseDate: '2026-10-15',
    lastContactDate: '2026-09-14',
    followupNotes: 'Discussed enterprise cyber security assessment and SOC compliance roadmap.',
    status: 'Qualified',
    lostReason: null,
    daysInPipeline: 14,
    isQualifiedLead: true,
    nextFollowupDate: '2026-09-14',
    followupStatus: 'Connected',
    assignedSalesUser: 'Pradeep',
    initials: 'SI',
    avatarTone: 'teal',
    source: 'Partner',
    stage: 'Qualified',
    requirement: 'Enterprise Cyber Security Assessment',
    estValue: '₹4.8L',
    score: 'A',
    createdAt: '2026-09-02T11:30:00.000Z',
    updatedAt: '2026-09-02T11:30:00.000Z',
    followupHistory: [
      {
        id: 'FL-201',
        date: '2026-09-14',
        status: 'Connected',
        notes: 'Discussed enterprise cyber security assessment and SOC compliance roadmap.',
        createdAt: '2026-09-14T10:00:00.000Z',
        userName: 'Pradeep',
      },
      {
        id: 'FL-202',
        date: '2026-09-07',
        status: 'Rescheduled',
        notes: 'Procurement team head was traveling; postponed site meeting.',
        createdAt: '2026-09-07T14:20:00.000Z',
        userName: 'Pradeep',
      },
    ],
  },
  {
    id: 'LD-0003',
    leadId: 'LD-0003',
    dateCaptured: '2026-09-03',
    leadName: 'Ravi S.',
    companyName: 'MRF Ltd',
    email: 'ravi.sharma@yahoo.com',
    leadEmail: 'ravi.sharma@yahoo.com',
    phone: '+91 97112 34567',
    leadNumber: '+91 97112 34567',
    leadSource: 'Cold Call',
    serviceInterest: 'Custom Software Development',
    industry: 'Retail & E-commerce',
    companySize: '1-10 Employees',
    pipelineStage: 'SQL',
    leadOwner: 'Sharmila',
    estimatedDealValue: '₹1.1L',
    probability: 30,
    expectedCloseDate: '2026-09-28',
    lastContactDate: '2026-09-11',
    followupNotes: 'Client requested revised quote for king size bed in Century engineered wood.',
    status: 'Contacted',
    lostReason: null,
    daysInPipeline: 13,
    isQualifiedLead: false,
    nextFollowupDate: '2026-09-11',
    followupStatus: 'Rescheduled',
    assignedSalesUser: 'Sharmila',
    initials: 'RS',
    avatarTone: 'amber',
    source: 'Cold Call',
    stage: 'Contacted',
    requirement: 'Beds ×2 · engineered wood',
    estValue: '₹1.1L',
    score: 'A',
    createdAt: '2026-09-03T09:15:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z',
    followupHistory: [
      {
        id: 'FL-301',
        date: '2026-09-11',
        status: 'Rescheduled',
        notes: 'Client requested revised quote for king size bed in Century engineered wood.',
        createdAt: '2026-09-11T12:00:00.000Z',
        userName: 'Sharmila',
      },
      {
        id: 'FL-302',
        date: '2026-09-04',
        status: 'Connected',
        notes: 'Inbound phone inquiry regarding hydraulic storage beds.',
        createdAt: '2026-09-04T09:45:00.000Z',
        userName: 'Sharmila',
      },
    ],
  },
  {
    id: 'LD-0004',
    leadId: 'LD-0004',
    dateCaptured: '2026-09-04',
    leadName: 'GreenNest Villas',
    companyName: 'MY TVS',
    email: 'procurement@greennest.com',
    leadEmail: 'procurement@greennest.com',
    phone: '+91 80234 56789',
    leadNumber: '+91 80234 56789',
    leadSource: 'Referral',
    serviceInterest: 'IT Consulting and Strategy',
    industry: 'Real Estate',
    companySize: '51-200 Employees',
    pipelineStage: 'Negotiation',
    leadOwner: 'Shanti',
    estimatedDealValue: '₹18.5L',
    probability: 90,
    expectedCloseDate: '2026-10-31',
    lastContactDate: '2026-09-16',
    followupNotes: 'Presentation given to GreenNest Villas procurement director for 12 villa package.',
    status: 'Qualified',
    lostReason: null,
    daysInPipeline: 12,
    isQualifiedLead: true,
    nextFollowupDate: '2026-09-16',
    followupStatus: 'Connected',
    assignedSalesUser: 'Shanti',
    initials: 'GV',
    avatarTone: 'teal',
    source: 'Referral',
    stage: 'Qualified',
    requirement: 'Full-home furniture · 12 villas',
    estValue: '₹18.5L',
    score: 'A',
    createdAt: '2026-09-04T14:20:00.000Z',
    updatedAt: '2026-09-04T14:20:00.000Z',
    followupHistory: [
      {
        id: 'FL-401',
        date: '2026-09-16',
        status: 'Connected',
        notes: 'Presentation given to GreenNest Villas procurement director for 12 villa package.',
        createdAt: '2026-09-16T16:00:00.000Z',
        userName: 'Shanti',
      },
      {
        id: 'FL-402',
        date: '2026-09-09',
        status: 'Connected',
        notes: 'Shared sample wood finishes and hardware catalogs.',
        createdAt: '2026-09-09T11:15:00.000Z',
        userName: 'Shanti',
      },
    ],
  },
  {
    id: 'LD-0005',
    leadId: 'LD-0005',
    dateCaptured: '2026-09-05',
    leadName: 'Faisal A.',
    companyName: 'TVS Automobile Solutions',
    email: 'faisal.ahmed@outlook.com',
    leadEmail: 'faisal.ahmed@outlook.com',
    phone: '+91 99001 12233',
    leadNumber: '+91 99001 12233',
    leadSource: 'Trade Show / Event',
    serviceInterest: 'Network Infrastructure',
    industry: 'Telecom',
    companySize: '1-10 Employees',
    pipelineStage: 'Lost',
    leadOwner: 'Brijesh',
    estimatedDealValue: '₹54K',
    probability: 0,
    expectedCloseDate: '2026-09-25',
    lastContactDate: '2026-09-20',
    followupNotes: 'Tried reaching twice for 6-seater dining set promo discount; no answer.',
    status: 'Cold',
    lostReason: 'Not Reachable / No Response',
    daysInPipeline: 11,
    isQualifiedLead: false,
    nextFollowupDate: '2026-09-20',
    followupStatus: 'RNR (Ring No Response)',
    assignedSalesUser: 'Brijesh',
    initials: 'FA',
    avatarTone: 'slate',
    source: 'Trade Show / Event',
    stage: 'Cold',
    requirement: 'Dining set · 6 seater',
    estValue: '₹54K',
    score: 'B',
    createdAt: '2026-09-05T16:45:00.000Z',
    updatedAt: '2026-09-05T16:45:00.000Z',
    followupHistory: [
      {
        id: 'FL-501',
        date: '2026-09-20',
        status: 'RNR (Ring No Response)',
        notes: 'Tried reaching twice for 6-seater dining set promo discount; no answer.',
        createdAt: '2026-09-15T16:30:00.000Z',
        userName: 'Brijesh',
      },
      {
        id: 'FL-502',
        date: '2026-09-08',
        status: 'Not Reachable',
        notes: 'Phone switched off during scheduled call window.',
        createdAt: '2026-09-08T17:00:00.000Z',
        userName: 'Brijesh',
      },
    ],
  },
  {
    id: 'LD-0006',
    leadId: 'LD-0006',
    dateCaptured: '2026-09-06',
    leadName: 'Lakshmi Builders',
    companyName: 'Yasho Industries',
    email: 'info@lakshmibuilders.org',
    leadEmail: 'info@lakshmibuilders.org',
    phone: '+91 94440 88776',
    leadNumber: '+91 94440 88776',
    leadSource: 'Email Campaign',
    serviceInterest: 'Data & Analytics',
    industry: 'Manufacturing',
    companySize: '51-200 Employees',
    pipelineStage: 'Proposal Sent',
    leadOwner: 'Client Reference',
    estimatedDealValue: '₹5.6L',
    probability: 70,
    expectedCloseDate: '2026-10-10',
    lastContactDate: '2026-09-13',
    followupNotes: 'Site office cabins inquiry follow-up, dropped note on WhatsApp.',
    status: 'Contacted',
    lostReason: null,
    daysInPipeline: 10,
    isQualifiedLead: true,
    nextFollowupDate: '2026-09-13',
    followupStatus: 'Not Reachable',
    assignedSalesUser: 'Client Reference',
    initials: 'LB',
    avatarTone: 'amber',
    source: 'Email Campaign',
    stage: 'Contacted',
    requirement: 'Site office furniture',
    estValue: '₹5.6L',
    score: 'A',
    createdAt: '2026-09-06T12:00:00.000Z',
    updatedAt: '2026-09-06T12:00:00.000Z',
    followupHistory: [
      {
        id: 'FL-601',
        date: '2026-09-13',
        status: 'Not Reachable',
        notes: 'Site office cabins inquiry follow-up, dropped note on WhatsApp.',
        createdAt: '2026-09-13T10:00:00.000Z',
        userName: 'Client Reference',
      },
      {
        id: 'FL-602',
        date: '2026-09-06',
        status: 'Connected',
        notes: 'Initial requirement gathering for on-site tech park construction office.',
        createdAt: '2026-09-06T13:30:00.000Z',
        userName: 'Client Reference',
      },
    ],
  },
];

const Container = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  width: 100%;
  padding: 24px 32px 40px;
  background-color: #f8fafc;
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23dbeafe' fill-opacity='1' d='M0,224L48,229.3C96,235,192,245,288,240C384,235,480,213,576,213.3C672,213,768,235,864,213.3C960,192,1056,128,1152,112C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23bfdbfe' fill-opacity='1' d='M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2360a5fa' fill-opacity='1' d='M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,213.3C672,171,768,85,864,64C960,43,1056,85,1152,106.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%232563eb' fill-opacity='0.15' d='M0,288L48,277.3C96,267,192,245,288,245.3C384,245,480,267,576,245.3C672,224,768,160,864,138.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #0f172a;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Sleek custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.32);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  color: #64748b;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SecondaryButton = styled.button`
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #e2e8f0;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.35);
  transition: all 0.15s ease;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// Toast Notification Banner
const ToastBanner = styled.div<{ isError?: boolean }>`
  position: fixed;
  top: 24px;
  right: 32px;
  z-index: 99999;
  background-color: ${props => props.isError ? '#fef2f2' : '#ecfdf5'};
  border: 1px solid ${props => props.isError ? '#fecaca' : '#a7f3d0'};
  color: ${props => props.isError ? '#991b1b' : '#065f46'};
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06);
  font-weight: 700;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInToast 0.25s ease-out;

  @keyframes slideInToast {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// KPI Metrics Grid
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const MetricCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    right: -15px;
    width: 90px;
    height: 70px;
    background: radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07);
    transform: translateY(-1px);
  }
`;

const MetricCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`;

const MetricIconContainer = styled.div<{ bg: string; color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${props => props.bg};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardOptionsBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 16px;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;

  &:hover {
    color: #475569;
    background: #f1f5f9;
  }
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const MetricLabel = styled.div`
  font-size: 13.5px;
  font-weight: 500;
  color: #475569;
  margin-top: 6px;
`;

const MetricFoot = styled.div<{ color?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.color || '#10b981'};
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Table Card Container
const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const TableTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const TableHeadingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TableIconContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TableTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
`;

const TableSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
`;

const FooterCount = styled.div`
  font-size: 12.5px;
  font-weight: 500;
  color: #64748b;
`;

const PaginationNav = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PageBtn = styled.button<{ active?: boolean }>`
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? '#2563eb' : '#e2e8f0'};
  background-color: ${props => props.active ? '#2563eb' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#475569'};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#1d4ed8' : '#f8fafc'};
    border-color: ${props => props.active ? '#1d4ed8' : '#cbd5e1'};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const PageSizeSelect = styled.select`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
  }
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12.5px;
  font-weight: 500;
  color: #0f172a;
  outline: none;
  width: 180px;
  max-width: 210px;
  flex: 1 1 150px;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    background: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;

const FilterSelect = styled.select`
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #e2e8f0;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  max-width: 135px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;

// Table and Elements
const TableResponsive = styled.div`
  overflow-x: auto;
  width: 100%;
  min-height: auto;
  padding-bottom: 16px;

  /* Sleek horizontal scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.32);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
`;

const Th = styled.th<{ alignRight?: boolean }>`
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 5;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  text-align: ${props => props.alignRight ? 'right' : 'left'};
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8fafc;
  }
`;

const Td = styled.td<{ alignRight?: boolean }>`
  padding: 14px 16px;
  font-weight: 500;
  color: #1e293b;
  vertical-align: middle;
  text-align: ${props => props.alignRight ? 'right' : 'left'};
`;

const LeadId = styled.span`
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
`;

const LeadCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LeadAvatar = styled.span<{ tone: 'violet' | 'teal' | 'amber' | 'slate' | 'brand' }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  color: #ffffff;
  background-color: ${props => {
    switch (props.tone) {
      case 'violet': return '#8b5cf6';
      case 'teal': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'slate': return '#64748b';
      case 'brand': return '#2563eb';
      default: return '#64748b';
    }
  }};
`;

const LeadInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LeadName = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 13.5px;
`;

const LeadJobTitle = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
`;

const LeadCompany = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
`;

const SourceBadge = styled.span<{ sourceName?: string }>`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  background-color: ${props => {
    switch (props.sourceName) {
      case 'Referral': return '#ede9fe';
      case 'Website': return '#eff6ff';
      case 'LinkedIn': return '#e0f2fe';
      case 'Cold Call': return '#ffedd5';
      case 'Email Campaign': return '#ccfbf1';
      case 'Trade Show / Event': return '#dcfce7';
      case 'Partner': return '#fce7f3';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.sourceName) {
      case 'Referral': return '#7c3aed';
      case 'Website': return '#2563eb';
      case 'LinkedIn': return '#0284c7';
      case 'Cold Call': return '#ea580c';
      case 'Email Campaign': return '#0d9488';
      case 'Trade Show / Event': return '#16a34a';
      case 'Partner': return '#db2777';
      default: return '#4b5563';
    }
  }};
`;

const RequirementText = styled.span`
  font-weight: 500;
  color: #334155;
`;

const ValueText = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 13.5px;
`;

const ScoreBadge = styled.span<{ score: 'A' | 'B'; source: string }>`
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
  background-color: ${props => {
    if (props.score === 'B') return 'rgba(139, 92, 246, 0.1)';
    if (props.source === 'WhatsApp') return 'rgba(16, 185, 129, 0.1)';
    if (props.source === 'Phone') return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(37, 99, 235, 0.1)';
  }};
  color: ${props => {
    if (props.score === 'B') return '#8b5cf6';
    if (props.source === 'WhatsApp') return '#10b981';
    if (props.source === 'Phone') return '#d97706';
    return '#2563eb';
  }};
`;

const StageBadge = styled.span<{ stage?: string }>`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
  background-color: ${props => {
    switch (props.stage) {
      case 'Attempted to Contact': return '#fef3c7';
      case 'Contacted': return '#fdf3e3';
      case 'Appointment Scheduled': return '#e0f2fe';
      case 'SQL': return '#e0e7ff';
      case 'Meeting Completed': return '#ede9fe';
      case 'Opportunity Identified': return '#fef9c3';
      case 'Proposal Sent': return '#eff6ff';
      case 'Negotiation':
      case 'In Negotiation': return '#ffedd5';
      case 'Closed and Waiting for Contact': return '#ccfbf1';
      case 'Closed and Contract Signed':
      case 'Won': return '#dcfce7';
      case 'Lost': return '#fee2e2';
      case 'New': return '#f0ebfe';
      case 'MQL': return '#e0f2fe';
      case 'Opportunity': return '#fef3c7';
      case 'Qualified': return '#e2f5f2';
      case 'Cold': return '#f3f4f6';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.stage) {
      case 'Attempted to Contact': return '#92400e';
      case 'Contacted': return '#b97a16';
      case 'Appointment Scheduled': return '#0284c7';
      case 'SQL': return '#4338ca';
      case 'Meeting Completed': return '#6d28d9';
      case 'Opportunity Identified': return '#a16207';
      case 'Proposal Sent': return '#1d4ed8';
      case 'Negotiation':
      case 'In Negotiation': return '#c2410c';
      case 'Closed and Waiting for Contact': return '#0f766e';
      case 'Closed and Contract Signed':
      case 'Won': return '#15803d';
      case 'Lost': return '#b91c1c';
      case 'New': return '#7c4deb';
      case 'MQL': return '#0369a1';
      case 'Opportunity': return '#b45309';
      case 'Qualified': return '#0d8577';
      case 'Cold': return '#6b7280';
      default: return '#334155';
    }
  }};
`;

const LeadIdBadge = styled.span`
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 11.5px;
  font-weight: 800;
  color: #1e293b;
  background-color: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

const IndustryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  white-space: nowrap;
`;

const ServiceInterestBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  background-color: #f5f3ff;
  color: #5b21b6;
  border: 1px solid #ddd6fe;
  white-space: nowrap;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProbabilityBadge = styled.span<{ value: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  background-color: ${props => {
    if (props.value >= 70) return '#dcfce7';
    if (props.value >= 40) return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.value >= 70) return '#15803d';
    if (props.value >= 40) return '#b45309';
    return '#b91c1c';
  }};
`;

const DaysBadge = styled.span<{ days: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
  background-color: ${props => {
    if (props.days <= 7) return '#dcfce7';
    if (props.days <= 20) return '#e0f2fe';
    return '#ffedd5';
  }};
  color: ${props => {
    if (props.days <= 7) return '#15803d';
    if (props.days <= 20) return '#0369a1';
    return '#c2410c';
  }};
`;

const LostReasonBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  white-space: nowrap;
`;

const NotesCell = styled.div`
  max-width: 180px;
  font-size: 11.5px;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
`;

const FormSectionTitle = styled.div`
  grid-column: span 2;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2563eb;
  border-bottom: 2px solid #dbeafe;
  padding-bottom: 4px;
  margin-top: 10px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const QualificationBadge = styled.span<{ isQualified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  background-color: ${props => props.isQualified ? 'rgba(18, 165, 148, 0.12)' : 'rgba(100, 116, 139, 0.12)'};
  color: ${props => props.isQualified ? '#12a594' : '#64748b'};
`;

const ContactLink = styled.a`
  color: #0f172a;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const SalesUserCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
`;

const SalesUserAvatar = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  font-size: 9.5px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const SalesUserName = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: #0f172a;
`;

const DateCell = styled.span`
  font-size: 12px;
  color: #4b5563;
  font-weight: 600;
  white-space: nowrap;
`;

const FollowupBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
`;

const FollowupCellWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const FollowupTriggerButton = styled.button`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 4px 9px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
  }
`;

const FollowupStatusPill = styled.span<{ statusType?: string }>`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  letter-spacing: 0.02em;
  ${props => {
    const s = (props.statusType || '').toLowerCase();
    if (s.includes('new')) {
      return 'background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;';
    }
    if (s.includes('contacted')) {
      return 'background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;';
    }
    if (s.includes('qualified')) {
      return 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;';
    }
    if (s.includes('proposal')) {
      return 'background: #fdf4ff; color: #86198f; border: 1px solid #f5d0fe;';
    }
    if (s.includes('negotiation')) {
      return 'background: #fffbeb; color: #b45309; border: 1px solid #fde68a;';
    }
    if (s.includes('won')) {
      return 'background: #f0fdf4; color: #166534; border: 1px solid #86efac;';
    }
    if (s.includes('lost')) {
      return 'background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;';
    }
    if (s.includes('cold')) {
      return 'background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;';
    }
    if (s.includes('yet')) {
      return 'background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;';
    }
    if (s.includes('connected')) {
      return 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;';
    }
    return 'background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;';
  }}
`;

const EditIndicator = styled.span`
  font-size: 10px;
  opacity: 0.5;
  transition: opacity 0.15s ease;

  ${FollowupTriggerButton}:hover & {
    opacity: 1;
    color: #3b82f6;
  }
`;

const VertexCallReasonTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


const FollowupModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

const FollowupModalCard = styled.div`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 12px 24px -6px rgba(0, 0, 0, 0.15);
  width: 520px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  box-sizing: border-box;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
`;

const PopoverTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PopoverCloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  line-height: 1;

  &:hover {
    color: #0f172a;
    background-color: #f1f5f9;
  }
`;

const PopoverTabBar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  gap: 6px;
  margin-top: -2px;
`;

const PopoverTabItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 8px;
  font-size: 12px;
  font-weight: ${props => props.active ? '700' : '600'};
  color: ${props => props.active ? '#2563eb' : '#64748b'};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${props => props.active ? '#1d4ed8' : '#0f172a'};
  }
`;

const PopoverTabBadge = styled.span<{ active?: boolean }>`
  background: ${props => props.active ? '#eff6ff' : '#f1f5f9'};
  color: ${props => props.active ? '#2563eb' : '#64748b'};
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
`;

const PopoverLeadMeta = styled.div`
  font-size: 11.5px;
  color: #64748b;
  margin-top: -4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    color: #1e293b;
  }
`;

const PopoverField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PopoverLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const PopoverInput = styled.input`
  font-size: 12.5px;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  color: #1e293b;
  background-color: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const PopoverSelect = styled.select`
  font-size: 12.5px;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  color: #1e293b;
  background-color: #ffffff;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const PopoverTextarea = styled.textarea`
  font-size: 12px;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  color: #1e293b;
  background-color: #ffffff;
  resize: vertical;
  min-height: 52px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const PopoverFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

const PopoverCancelBtn = styled.button`
  background: none;
  border: 1px solid #cbd5e1;
  color: #475569;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const PopoverSaveBtn = styled.button`
  background: #2563eb;
  border: none;
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimelineSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const TimelineSectionTitle = styled.div`
  font-size: 12.5px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TimelineBadgeCount = styled.span`
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 10px;
`;

const TimelineDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 4px 0;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
  margin-top: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 2px;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
  padding-bottom: 14px;

  &:last-child {
    padding-bottom: 2px;
  }
`;

const TimelineLeftCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  min-width: 24px;
`;

const TimelineDot = styled.span<{ statusType?: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  ${props => {
    const s = (props.statusType || '').toLowerCase();
    if (s.includes('connected')) return 'border-color: #10b981; background: #ecfdf5;';
    if (s.includes('call back')) return 'border-color: #f59e0b; background: #fefce8;';
    if (s.includes('rescheduled')) return 'border-color: #3b82f6; background: #eff6ff;';
    if (s.includes('rnr') || s.includes('ring')) return 'border-color: #f97316; background: #fff7ed;';
    if (s.includes('reachable')) return 'border-color: #ef4444; background: #fef2f2;';
    if (s.includes('interested')) return 'border-color: #8b5cf6; background: #f5f3ff;';
    return 'border-color: #94a3b8; background: #f8fafc;';
  }}
`;

const TimelineLine = styled.div`
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin-top: 2px;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const TimelineContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TimelineDateText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
`;

const TimelineNoteBubble = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11.5px;
  color: #1e293b;
  line-height: 1.4;
  word-break: break-word;
`;

const TimelineMetaText = styled.span`
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
`;

const TimelineEmptyText = styled.div`
  text-align: center;
  padding: 16px;
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 600;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
`;

const getStatusColor = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('yet')) return '#6366f1';
  if (s.includes('connected')) return '#10b981';
  if (s.includes('call back')) return '#f59e0b';
  if (s.includes('rescheduled')) return '#3b82f6';
  if (s.includes('rnr') || s.includes('ring')) return '#ea580c';
  if (s.includes('reachable')) return '#ef4444';
  if (s.includes('interested')) return '#8b5cf6';
  return '#6366f1';
};

const getLeadDefaultTimeline = (lead: any): FollowupTimelineItem[] => {
  if (lead?.followupHistory && lead.followupHistory.length > 0) {
    return lead.followupHistory;
  }
  const match = INITIAL_LEADS.find(init => init.id === lead?.id);
  if (match?.followupHistory && match.followupHistory.length > 0) {
    return match.followupHistory;
  }

  const req = lead?.requirement || 'Enterprise IT Infrastructure';
  const name = lead?.leadName || lead?.companyName || 'Client';
  const rep = lead?.leadOwner || lead?.assignedSalesUser || 'Aravind';
  const nextDate = lead?.nextFollowupDate || '2026-09-16';
  const isNew = (lead?.status || lead?.stage) === 'New';
  const currentStatus = lead?.followupStatus || (isNew ? 'Yet to Call' : 'Connected');
  const source = lead?.leadSource || lead?.source || 'Website';

  return [
    {
      id: `FL-${lead?.id || 'lead'}-1`,
      date: nextDate,
      status: currentStatus,
      callReason: lead?.callReason || (isNew ? 'Initial Qualification & Discovery' : 'Quotation & Price Estimation'),
      notes: isNew
        ? (lead?.yetToCallNotes || `Lead received from ${source}. Scheduled for initial discovery call.`)
        : `Review proposal, volume pricing, and delivery timeline for ${req}.`,
      createdAt: '2026-09-15T11:00:00.000Z',
      userName: rep,
    },
    {
      id: `FL-${lead?.id || 'lead'}-2`,
      date: '2026-09-11',
      status: 'Connected',
      callReason: 'Product Catalog & Sample Request',
      notes: `Shared service proposal, technical architecture deck, and discounted estimate with ${name}.`,
      createdAt: '2026-09-11T14:30:00.000Z',
      userName: rep,
    },
    {
      id: `FL-${lead?.id || 'lead'}-3`,
      date: '2026-09-07',
      status: 'Rescheduled',
      callReason: 'Site Measurement Coordination',
      notes: `Site measurement session postponed upon client request; samples dispatched to site office.`,
      createdAt: '2026-09-07T16:15:00.000Z',
      userName: 'Aravind',
    },
    {
      id: `FL-${lead?.id || 'lead'}-4`,
      date: '2026-09-02',
      status: 'Yet to Call',
      callReason: 'Initial Qualification & Discovery',
      notes: `Initial lead captured via ${source}. Customer requested catalog and volume quote.`,
      createdAt: '2026-09-02T10:00:00.000Z',
      userName: 'Ladera Technology',
    },
  ];
};

const VertexTimelineContainer = styled.div`
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 10px 16px;
  max-height: 290px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 6px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const VertexCentralAxis = styled.div`
  position: absolute;
  top: 26px;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: #475569;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #475569;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #475569;
    border-radius: 50%;
  }
`;

const VertexTimelineRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 14px;
  z-index: 2;

  &:last-child {
    margin-bottom: 2px;
  }
`;

const VertexSideCol = styled.div<{ isLeft: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isLeft ? 'flex-end' : 'flex-start'};
`;

const VertexCenterHub = styled.div`
  width: 20px;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
`;

const VertexSpineTick = styled.div`
  width: 10px;
  height: 2px;
  background: #334155;
  border-radius: 1px;
`;

const VertexDottedLine = styled.div`
  flex: 1;
  height: 0;
  border-top: 2px dotted #64748b;
  min-width: 12px;
  max-width: 36px;
`;

const VertexMarkerSquare = styled.div<{ statusType?: string }>`
  width: 10px;
  height: 10px;
  min-width: 10px;
  background: ${props => getStatusColor(props.statusType)};
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  margin: 0 4px;
`;

const VertexMilestoneCard = styled.div<{ isLeft: boolean; statusType?: string }>`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 9px;
  box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.07);
  width: 175px;
  max-width: 175px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
  border-left: ${props => props.isLeft ? '1px solid #e2e8f0' : `3px solid ${getStatusColor(props.statusType)}`};
  border-right: ${props => props.isLeft ? `3px solid ${getStatusColor(props.statusType)}` : '1px solid #e2e8f0'};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.12);
  }
`;

const VertexCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const VertexDateBadge = styled.span`
  font-size: 9.5px;
  font-weight: 800;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 5px;
  border-radius: 4px;
  white-space: nowrap;
`;

const VertexNoteText = styled.div`
  font-size: 11px;
  line-height: 1.35;
  color: #334155;
  word-break: break-word;
  background: #f8fafc;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  max-height: 52px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
  }
`;

const VertexMetaRow = styled.div`
  font-size: 9px;
  color: #94a3b8;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VertexSpineCap = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
`;

const VertexCapBadge = styled.span`
  font-size: 9.5px;
  font-weight: 800;
  color: #475569;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const TextActionButton = styled.button<{ danger?: boolean }>`
  background: #ffffff;
  border: 1px solid ${props => props.danger ? '#fecaca' : '#bfdbfe'};
  color: ${props => props.danger ? '#ef4444' : '#2563eb'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.danger ? '#fef2f2' : '#eff6ff'};
    border-color: ${props => props.danger ? '#ef4444' : '#2563eb'};
  }
`;

const ConvertButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Ladera CRM Enhanced Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 780px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const ModalHeaderBanner = styled.div`
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  padding: 18px 24px;
  border-radius: 24px 24px 0 0;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalHeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalHeaderTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
`;

const ModalHeaderSubtitle = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

const ModalCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  grid-column: ${props => props.fullWidth ? 'span 2' : 'auto'};

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const FormLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredStar = styled.span`
  color: #ef4444;
  font-weight: 800;
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  transition: all 0.15s ease;
  background-color: ${props => props.hasError ? '#fef2f2' : '#ffffff'};
  color: #0f172a;

  &:focus {
    border-color: ${props => props.hasError ? '#ef4444' : '#2563eb'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  min-height: 70px;
  resize: vertical;
  transition: all 0.15s ease;
  font-family: inherit;
  background-color: ${props => props.hasError ? '#fef2f2' : '#ffffff'};
  color: #0f172a;

  &:focus {
    border-color: ${props => props.hasError ? '#ef4444' : '#2563eb'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const FormSelect = styled.select<{ hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${props => props.hasError ? '#ef4444' : '#2563eb'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
  }
`;

const MultiSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const MultiSelectTrigger = styled.div<{ isOpen?: boolean }>`
  min-height: 42px;
  padding: 6px 12px;
  border: 1px solid ${props => props.isOpen ? '#2563eb' : '#e2e8f0'};
  border-radius: 10px;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  transition: all 0.15s ease;
  box-shadow: ${props => props.isOpen ? '0 0 0 2px rgba(37, 99, 235, 0.15)' : 'none'};

  &:hover {
    border-color: #cbd5e1;
  }
`;

const MultiSelectChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
`;

const MultiSelectChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
`;

const ChipRemoveBtn = styled.button`
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  font-size: 11px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover {
    color: #1d4ed8;
  }
`;

const MultiSelectPlaceholder = styled.span`
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
`;

const MultiSelectDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  padding: 4px;
`;

const MultiSelectOption = styled.div<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: ${props => props.isSelected ? 700 : 500};
  color: ${props => props.isSelected ? '#1d4ed8' : '#334155'};
  background-color: ${props => props.isSelected ? '#eff6ff' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const MultiSelectCheckbox = styled.input`
  width: 15px;
  height: 15px;
  accent-color: #2563eb;
  cursor: pointer;
`;

const FieldError = styled.span`
  color: #ef4444;
  font-size: 11.5px;
  font-weight: 700;
  margin-top: 2px;
`;

const ErrorBanner = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

// SVGs for Ladera CRM CX
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  </svg>
);

const PhoneCallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2a9 9 0 0 1 9 9" />
    <path d="M13 6a5 5 0 0 1 5 5" />
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </svg>
);

const Share2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const getSourceMeta = (sourceName: string) => {
  switch (sourceName) {
    case 'Website':
      return {
        icon: <GlobeIcon />,
        bg: 'rgba(6, 182, 212, 0.1)',
        color: '#0284c7',
        tag: '0% web portal',
      };
    case 'LinkedIn':
      return {
        icon: <Share2Icon />,
        bg: 'rgba(10, 102, 194, 0.1)',
        color: '#0a66c2',
        tag: 'social prospecting',
      };
    case 'Cold Call':
      return {
        icon: <PhoneCallIcon />,
        bg: 'rgba(139, 92, 246, 0.1)',
        color: '#8b5cf6',
        tag: '0% cold call outreach',
      };
    case 'Email Campaign':
      return {
        icon: <MailIcon />,
        bg: 'rgba(124, 58, 237, 0.1)',
        color: '#7c3aed',
        tag: 'targeted campaign',
      };
    case 'Partner':
      return {
        icon: <UsersIcon />,
        bg: 'rgba(219, 39, 119, 0.1)',
        color: '#db2777',
        tag: 'alliance partner',
      };
    case 'Referral':
      return {
        icon: <UserPlusIcon />,
        bg: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        tag: '0% referral',
      };
    case 'Trade Show / Event':
      return {
        icon: <TargetIcon />,
        bg: 'rgba(234, 88, 12, 0.1)',
        color: '#ea580c',
        tag: 'event engagement',
      };
    default:
      return {
        icon: <Share2Icon />,
        bg: 'rgba(99, 102, 241, 0.1)',
        color: '#6366f1',
        tag: 'direct channel',
      };
  }
};

const SALES_USERS = [
  'Aravind',
  'Pradeep',
  'Sharmila',
  'Shanti',
  'Brijesh',
];

const formatDateDisplay = (dateStr?: string | null) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const FOLLOWUP_STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'In Negotiation',
  'Won',
  'Lost',
  'Cold',
];

const CALL_REASON_OPTIONS = [
  'Initial Qualification & Discovery',
  'Product Catalog & Sample Request',
  'Quotation & Price Estimation',
  'Site Measurement Coordination',
  'Payment & Order Confirmation',
  'Customer Support / Escalation',
  'General Follow-up',
];

const COMPANY_NAME_OPTIONS = [
  'Aban Offshore',
  'Accel IT Services',
  'Danfoss',
  'Elgi Equipment',
  'Heat and Controls',
  'Modelama Exports',
  'MRF Ltd',
  'MY TVS',
  'Nestavia HFL',
  'Sanmina Tech Services',
  'TVS Automobile Solutions',
  'Yasho Industries',
  'Others',
];

const LEAD_SOURCE_OPTIONS = [
  'Referral',
  'Website',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Trade Show / Event',
  'Partner',
  'Other',
];

const SERVICE_INTEREST_OPTIONS = [
  'Cloud Migration',
  'Managed IT Support',
  'Cyber Security Services',
  'Custom Software Development',
  'IT Consulting and Strategy',
  'Network Infrastructure',
  'Data & Analytics',
  'Cloud Hosting / DevOps',
  'Others',
];

const INDUSTRY_OPTIONS = [
  'Banking and Finance',
  'Healthcare',
  'Retail & E-commerce',
  'Manufacturing',
  'Education',
  'Government',
  'Real Estate',
  'Telecom',
  'Others',
];

const COMPANY_SIZE_OPTIONS = [
  '1-10 Employees',
  '11-50 Employees',
  '51-200 Employees',
  '201-500 Employees',
  '500+ Enterprise',
  'Individual / Freelance Architect',
];

const PIPELINE_STAGE_OPTIONS = [
  'Attempted to Contact',
  'Contacted',
  'Appointment Scheduled',
  'SQL',
  'Meeting Completed',
  'Opportunity Identified',
  'Proposal Sent',
  'Negotiation',
  'Closed and Waiting for Contact',
  'Closed and Contract Signed',
  'Lost',
];

const STAGE_TO_PROBABILITY: Record<string, number> = {
  'Attempted to Contact': 10,
  'attempted to contact': 10,
  'Contacted': 20,
  'contacted': 20,
  'Appointment Scheduled': 25,
  'appointment scheduled': 25,
  'SQL': 30,
  'sql': 30,
  'Meeting Completed': 40,
  'meeting completed': 40,
  'Opportunity Identified': 50,
  'opportunity identified': 50,
  'Proposal Sent': 70,
  'proposal sent': 70,
  'Negotiation': 90,
  'negotiation': 90,
  'Closed and Waiting for Contact': 95,
  'closed and waiting for contact': 95,
  'Closed, awaiting contract': 95,
  'Closed and Contract Signed': 100,
  'closed and contract signed': 100,
  'Lost': 0,
  'lost': 0,
  'New': 10,
  'MQL': 20,
  'Opportunity': 50,
  'Won': 100,
};

const LEAD_OWNER_OPTIONS = [
  'Aravind',
  'Pradeep',
  'Sharmila',
  'Shanti',
  'Brijesh',
];

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'In Negotiation',
  'Won',
  'Lost',
  'Cold',
];

const LOST_REASON_OPTIONS = [
  'Price / Budget Constraint',
  'Competitor Chosen',
  'Project Delayed / Postponed',
  'Not Reachable / No Response',
  'Feature / Specification Mismatch',
  'Timeline Unmet',
  'Change of Mind / Cancelled',
  'Other',
];

const PROBABILITY_OPTIONS = [0, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 95, 100];

interface DealValueOption {
  label: string;
  amount: number;
}

const INR_DEAL_VALUE_OPTIONS: DealValueOption[] = [
  { label: '₹50,000 (₹50K)', amount: 50000 },
  { label: '₹1,00,000 (₹1L)', amount: 100000 },
  { label: '₹2,00,000 (₹2L)', amount: 200000 },
  { label: '₹2,50,000 (₹2.5L)', amount: 250000 },
  { label: '₹5,00,000 (₹5L)', amount: 500000 },
  { label: '₹10,00,000 (₹10L)', amount: 1000000 },
  { label: '₹25,00,000 (₹25L)', amount: 2500000 },
  { label: '₹50,00,000 (₹50L)', amount: 5000000 },
  { label: '₹1,00,00,000 (₹1 Cr)', amount: 10000000 },
];

const AED_DEAL_VALUE_OPTIONS: DealValueOption[] = [
  { label: 'AED 2,500', amount: 2500 },
  { label: 'AED 5,000', amount: 5000 },
  { label: 'AED 10,000', amount: 10000 },
  { label: 'AED 25,000', amount: 25000 },
  { label: 'AED 50,000', amount: 50000 },
  { label: 'AED 100,000', amount: 100000 },
  { label: 'AED 250,000', amount: 250000 },
  { label: 'AED 500,000', amount: 500000 },
  { label: 'AED 1,000,000', amount: 1000000 },
];

const convertToUsd = (amount: number, currency: 'INR' | 'AED'): number => {
  if (currency === 'INR') {
    return Math.round(amount / 83.33);
  } else {
    return Math.round(amount / 3.6725);
  }
};

const toInputDateFormat = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const extractFollowupStatus = (lead: LeadItem): string => {
  if (lead.followupStatus && FOLLOWUP_STATUS_OPTIONS.includes(lead.followupStatus)) return lead.followupStatus;
  if (lead.followupStatus) return lead.followupStatus;
  if (lead.notes) {
    const match = lead.notes.match(/^\[Status:\s*([^|\]]+)/);
    if (match && match[1]) {
      const found = FOLLOWUP_STATUS_OPTIONS.find(o => o.toLowerCase() === match[1].trim().toLowerCase());
      if (found) return found;
      return match[1].trim();
    }
  }
  if (lead.status && FOLLOWUP_STATUS_OPTIONS.includes(lead.status)) return lead.status;
  return 'New';
};

const extractCallReason = (lead: LeadItem): string => {
  if (lead.callReason) return lead.callReason;
  if (lead.notes) {
    const match = lead.notes.match(/Reason:\s*([^\]]+)\]/);
    if (match) return match[1].trim();
  }
  return 'Initial Qualification & Discovery';
};

const extractYetToCallNotes = (lead: LeadItem): string => {
  if (lead.yetToCallNotes) return lead.yetToCallNotes;
  if (lead.requirement) return lead.requirement;
  return extractFollowupNotes(lead);
};

const extractFollowupNotes = (lead: LeadItem): string => {
  if (!lead.notes) return '';
  return lead.notes.replace(/^\[Status:[^\]]+\]\s*/, '');
};

const getStatusIcon = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('new')) return '✨';
  if (s.includes('contacted')) return '📞';
  if (s.includes('qualified')) return '🎯';
  if (s.includes('proposal')) return '📄';
  if (s.includes('negotiation')) return '🤝';
  if (s.includes('won')) return '🎉';
  if (s.includes('lost')) return '❌';
  if (s.includes('cold')) return '❄️';
  if (s.includes('yet')) return '⏳';
  if (s.includes('connected')) return '📞';
  if (s.includes('meeting')) return '🤝';
  return '📅';
};

const formatRelativeTime = (dateStr: string) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const parseEstValueToAmount = (val?: string | null): { micros: number; numeric: number } => {
  if (!val) return { micros: 100000000000, numeric: 100000 };
  const cleaned = val.replace(/^[₹$RsINR\s,]+/i, '').trim().toUpperCase();
  let num = parseFloat(cleaned.replace(/,/g, '')) || 1;
  if (cleaned.endsWith('CR') || cleaned.endsWith('CRORE')) {
    num = num * 10000000;
  } else if (cleaned.endsWith('L') || cleaned.endsWith('LAC') || cleaned.endsWith('LAKH')) {
    num = num * 100000;
  } else if (cleaned.endsWith('K')) {
    num = num * 1000;
  } else if (num < 1000 && !val.includes('$')) {
    num = num * 100000;
  }
  return {
    numeric: Math.round(num),
    micros: Math.round(num * 1000000),
  };
};

interface FormDataState {
  leadId: string;
  dateCaptured: string;
  leadName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  leadSource: string;
  serviceInterest: string;
  industry: string;
  companySize: string;
  pipelineStage: string;
  leadOwner: string;
  estimatedDealValue: string;
  probability: number;
  expectedCloseDate: string;
  lastContactDate: string;
  nextFollowupDate: string;
  followupNotes: string;
  status: string;
  lostReason: string;
  daysInPipeline: number | string;
}


const generateNextLeadId = (currentLeads: LeadItem[]) => {
  let maxId = 0;
  currentLeads.forEach(lead => {
    const match = (lead.id || '').match(/LD-(\d+)/) || (lead.leadId || '').match(/LD-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) maxId = num;
    }
  });
  return `LD-${String(maxId + 1).padStart(4, '0')}`;
};

const ViewOnlyDetailItem = ({ label, value, fullWidth }: { label: string, value: any, fullWidth?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: fullWidth ? 'span 2' : 'auto' }}>
    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a', whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{value || '-'}</span>
  </div>
);


export const LeadsPage = () => {
  const setIsNavigationDrawerExpanded = useSetAtomState(isNavigationDrawerExpandedState);
  useEffect(() => {
    setIsNavigationDrawerExpanded(true);
  }, [setIsNavigationDrawerExpanded]);

  const navigate = useNavigate();
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const { createOneRecord: createOpportunity } = useCreateOneRecord({
    objectNameSingular: 'opportunity',
  });

  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [kpis, setKpis] = useState<LeadKpis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All stages');
  const [selectedSource, setSelectedSource] = useState<string>('All sources');
  const [selectedCompany, setSelectedCompany] = useState<string>('All companies');
  const [selectedOwner, setSelectedOwner] = useState<string>('All owners');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnlyModal, setIsViewOnlyModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = React.useRef<HTMLDivElement>(null);
  const [dealCurrency, setDealCurrency] = useState<'INR' | 'AED'>('INR');
  const [dealSelectedAmount, setDealSelectedAmount] = useState<string>('');

  const handleDealCurrencyChange = (newCurrency: 'INR' | 'AED') => {
    setDealCurrency(newCurrency);
    if (dealSelectedAmount) {
      const numericAmount = Number(dealSelectedAmount);
      if (!isNaN(numericAmount) && numericAmount > 0) {
        const usd = convertToUsd(numericAmount, newCurrency);
        setFormData(prev => ({ ...prev, estimatedDealValue: `$${usd.toLocaleString('en-US')}` }));
      }
    }
  };

  const handleDealAmountChange = (amountStr: string) => {
    setDealSelectedAmount(amountStr);
    if (!amountStr) {
      setFormData(prev => ({ ...prev, estimatedDealValue: '' }));
      return;
    }
    const numericAmount = Number(amountStr);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const usd = convertToUsd(numericAmount, dealCurrency);
      setFormData(prev => ({ ...prev, estimatedDealValue: `$${usd.toLocaleString('en-US')}` }));
    }
  };

  const handleConvertToDeal = async (lead: LeadItem) => {
    setConvertingId(lead.id);
    try {
      const parsed = parseEstValueToAmount(lead.estValue);
      const dealTitle = lead.companyName
        ? `${lead.companyName} · ${lead.requirement || 'Modular Furniture Setup'}`
        : `${lead.leadName} · ${lead.requirement || 'Furniture Order'}`;

      try {
        await createOpportunity({
          id: v4(),
          name: dealTitle,
          amount: {
            amountMicros: parsed.micros,
            currencyCode: 'INR',
          },
          stage: 'PROPOSAL',
          closeDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        });
      } catch (gqlErr) {
        console.warn('Create opportunity notice:', gqlErr);
      }

      try {
        await fetch(`/rest/leads/${lead.id}/convert`, { method: 'POST' });
      } catch {
        await fetch(`/rest/leads/${lead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isQualifiedLead: true, status: 'Qualified' }),
        });
      }

      setLeads(prev =>
        prev.map(item =>
          item.id === lead.id
            ? { ...item, isQualifiedLead: true, status: 'Qualified' }
            : item,
        ),
      );

      showToast(`🎉 Converted "${lead.companyName || lead.leadName}" to Deal! Opening Deals...`);

      setTimeout(() => {
        navigate('/objects/opportunities');
      }, 700);
    } catch (err: any) {
      console.error('Convert to deal error:', err);
      showToast(`Failed to convert lead: ${err.message || 'Unknown error'}`, true);
    } finally {
      setConvertingId(null);
    }
  };

  const [formData, setFormData] = useState<FormDataState>({
    leadId: '',
    dateCaptured: new Date().toISOString().split('T')[0],
    leadName: '',
    jobTitle: '',
    companyName: '',
    email: '',
    phone: '',
    leadSource: '',
    serviceInterest: '',
    industry: '',
    companySize: '',
    pipelineStage: '',
    leadOwner: '',
    estimatedDealValue: '',
    probability: 0,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    nextFollowupDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    followupNotes: '',
    status: '',
    lostReason: '',
    daysInPipeline: 0,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Inline Follow-up & Timeline state
  const [activeFollowupLeadId, setActiveFollowupLeadId] = useState<string | null>(null);
  const [inlineDate, setInlineDate] = useState<string>('');
  const [inlineNextDate, setInlineNextDate] = useState<string>('');
  const [inlineStatus, setInlineStatus] = useState<string>('');
  const [inlineCallReason, setInlineCallReason] = useState<string>('Initial Qualification & Discovery');
  const [inlineNotes, setInlineNotes] = useState<string>('');
  const [isSavingFollowup, setIsSavingFollowup] = useState<boolean>(false);
  const [popoverActiveTab, setPopoverActiveTab] = useState<'followup' | 'timeline'>('followup');

  const handleOpenInlineFollowup = (lead: LeadItem, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActiveFollowupLeadId(lead.id);
    setInlineDate(toInputDateFormat(lead.lastContactDate) || new Date().toISOString().split('T')[0]);
    setInlineNextDate(toInputDateFormat(lead.nextFollowupDate) || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    const currentStat = extractFollowupStatus(lead) || 'New';
    setInlineStatus(currentStat);
    setInlineCallReason(lead.callReason || extractCallReason(lead) || 'Initial Qualification & Discovery');
    setInlineNotes(lead.status === 'New' && currentStat === 'New' ? '' : extractFollowupNotes(lead));
    setPopoverActiveTab('timeline');
  };


  const handleCloseInlineFollowup = () => {
    setActiveFollowupLeadId(null);
    setIsSavingFollowup(false);
  };

  const handleSaveInlineFollowup = async (leadId: string) => {
    setIsSavingFollowup(true);

    const lead = leads.find(l => l.id === leadId);
    const existingHistory = (lead?.followupHistory && lead.followupHistory.length > 0)
      ? lead.followupHistory
      : getLeadDefaultTimeline(lead);

    const newTimelineItem: FollowupTimelineItem = {
      id: 'FL-' + Date.now(),
      date: inlineDate || new Date().toISOString().split('T')[0],
      status: inlineStatus || 'New',
      callReason: inlineCallReason || 'Initial Qualification & Discovery',
      notes: inlineNotes.trim() || `Status updated to ${inlineStatus || 'New'}`,
      createdAt: new Date().toISOString(),
      userName: lead?.assignedSalesUser || lead?.leadOwner || 'Aravind (Customer Care)',
    };

    const updatedHistory = [newTimelineItem, ...existingHistory];

    const formattedNotes = `[Status: ${inlineStatus || 'New'} | Reason: ${inlineCallReason || 'Initial Qualification & Discovery'}] ${inlineNotes.trim()}`;

    const payload = {
      lastContactDate: inlineDate || null,
      nextFollowupDate: inlineNextDate || null,
      followupStatus: inlineStatus || 'New',
      status: inlineStatus || lead?.status || 'New',
      callReason: inlineCallReason || 'Initial Qualification & Discovery',
      notes: formattedNotes || null,
    };

    // Optimistically update local state immediately
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            lastContactDate: inlineDate || null,
            nextFollowupDate: inlineNextDate || null,
            followupStatus: inlineStatus || 'New',
            status: inlineStatus || l.status || 'New',
            callReason: inlineCallReason || 'Initial Qualification & Discovery',
            notes: formattedNotes,
            followupHistory: updatedHistory,
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      }),
    );

    try {
      const res = await fetch(`/rest/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated: LeadItem = await res.json();
        setLeads(prev =>
          prev.map(l =>
            l.id === leadId
              ? {
                  ...l,
                  ...updated,
                  followupStatus: inlineStatus || updated.followupStatus || 'Yet to Call',
                  callReason: inlineCallReason || updated.callReason || 'Initial Qualification & Discovery',
                  followupHistory: updatedHistory,
                }
              : l,
          ),
        );
      }
      showToast('Follow-up logged and timeline updated!');
    } catch {
      showToast('Follow-up saved locally.');
    } finally {
      setIsSavingFollowup(false);
      setActiveFollowupLeadId(null);
    }
  };

  // Close inline popover on Escape key
  useEffect(() => {
    if (!activeFollowupLeadId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveFollowupLeadId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFollowupLeadId]);

  // Close service multi-select dropdown on click outside
  useEffect(() => {
    if (!isServiceDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

  const selectedServices = useMemo(() => {
    if (!formData.serviceInterest) return [];
    return formData.serviceInterest
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [formData.serviceInterest]);

  const handleToggleService = (serviceName: string) => {
    const current = formData.serviceInterest
      ? formData.serviceInterest.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const next = current.includes(serviceName)
      ? current.filter(s => s !== serviceName)
      : [...current, serviceName];

    setFormData(prev => ({
      ...prev,
      serviceInterest: next.join(', '),
    }));
  };

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch leads and KPIs from backend API
  const loadLeadsFromApi = async () => {
    try {
      const [leadsRes, kpiRes] = await Promise.all([
        fetch('/rest/leads'),
        fetch('/rest/leads/kpis'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized: LeadItem[] = data.map((l: any) => {
            const dateCap = l.dateCaptured || (l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : '2026-09-01');
            const capTime = new Date(dateCap).getTime();
            const calculatedDays = isNaN(capTime) ? 0 : Math.max(0, Math.floor((Date.now() - capTime) / (1000 * 3600 * 24)));
            const rawSource = l.leadSource || l.source || 'Website';
            const normalizedSource = rawSource === 'WhatsApp' ? 'LinkedIn' : (rawSource === 'Phone' ? 'Cold Call' : (rawSource === 'Walk-in' ? 'Trade Show / Event' : rawSource));
            const rawStage = l.pipelineStage || l.stage || l.status || 'Attempted to Contact';
            const normalizedStage = rawStage === 'New' ? 'Attempted to Contact' : rawStage;
            const prob = (l.probability !== undefined && l.probability !== null) ? Number(l.probability) : (STAGE_TO_PROBABILITY[normalizedStage] ?? 20);

            return {
              ...l,
              leadId: l.leadId || l.id,
              dateCaptured: dateCap,
              leadName: l.leadName || 'Unknown',
              jobTitle: l.jobTitle || l.Job_Title || null,
              companyName: l.companyName || null,
              email: l.email || l.leadEmail || null,
              leadEmail: l.email || l.leadEmail || null,
              phone: l.phone || l.leadNumber || '+91 98000 00000',
              leadNumber: l.phone || l.leadNumber || '+91 98000 00000',
              leadSource: normalizedSource,
              source: normalizedSource,
              serviceInterest: l.serviceInterest || l.requirement || 'Cloud Migration',
              requirement: l.serviceInterest || l.requirement || 'Cloud Migration',
              industry: l.industry || 'Banking and Finance',
              companySize: l.companySize || '11-50 Employees',
              pipelineStage: normalizedStage,
              stage: normalizedStage,
              leadOwner: l.leadOwner || l.assignedSalesUser || 'Aravind',
              assignedSalesUser: l.leadOwner || l.assignedSalesUser || 'Aravind',
              estimatedDealValue: l.estimatedDealValue || l.estValue || '₹2.5L',
              estValue: l.estimatedDealValue || l.estValue || '₹2.5L',
              probability: prob,
              expectedCloseDate: l.expectedCloseDate || null,
              lastContactDate: l.lastContactDate || null,
              nextFollowupDate: l.nextFollowupDate || null,
              followupNotes: l.followupNotes || l.notes || l.yetToCallNotes || null,
              notes: l.followupNotes || l.notes || null,
              status: l.status || 'New',
              lostReason: l.lostReason || null,
              daysInPipeline: l.daysInPipeline !== undefined ? Number(l.daysInPipeline) : calculatedDays,
              isQualifiedLead: l.isQualifiedLead !== undefined ? l.isQualifiedLead : (l.status === 'Qualified' || l.pipelineStage === 'Won'),
              followupStatus: l.followupStatus || ((l.status || l.stage) === 'New' ? 'Yet to Call' : extractFollowupStatus(l) || 'Yet to Call'),
              callReason: l.callReason || extractCallReason(l) || 'Initial Qualification & Discovery',
              yetToCallNotes: l.yetToCallNotes || extractYetToCallNotes(l),
              followupHistory: (l.followupHistory && l.followupHistory.length > 0)
                ? l.followupHistory
                : getLeadDefaultTimeline(l),
              createdAt: l.createdAt || new Date().toISOString(),
              updatedAt: l.updatedAt || new Date().toISOString(),
            };
          });
          setLeads(normalized);
        }
      }

      if (kpiRes.ok) {
        const kpiData = await kpiRes.json();
        setKpis(kpiData);
      }
    } catch (err) {
      console.warn('Backend leads API unavailable, using cached state', err);
    }
  };

  useEffect(() => {
    loadLeadsFromApi();
  }, []);

  // Client-side form validation
  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!formData.leadName.trim()) {
      errs.leadName = 'Lead / Contact name is required';
    } else if (formData.leadName.trim().length < 2) {
      errs.leadName = 'Name must be at least 2 characters long';
    }

    if (!formData.companyName.trim()) {
      errs.companyName = 'Company name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Lead phone number is required';
    } else if (!/^[0-9+\s\-()]{7,20}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number (at least 7 digits)';
    }

    if (!formData.leadSource) {
      errs.leadSource = 'Please select a lead source';
    }

    if (!formData.pipelineStage) {
      errs.pipelineStage = 'Please select a pipeline stage';
    }

    return errs;
  }, [formData]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = e.target.getAttribute('data-field') || e.target.name;
    const { value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: value };
      if (fieldName === 'dateCaptured') {
        const capTime = new Date(value).getTime();
        if (!isNaN(capTime)) {
          updated.daysInPipeline = Math.max(0, Math.floor((Date.now() - capTime) / (1000 * 3600 * 24)));
        }
      }
      if (fieldName === 'daysInPipeline') {
        updated.daysInPipeline = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
      }
      if (fieldName === 'pipelineStage') {
        const mappedProb = STAGE_TO_PROBABILITY[value] ?? STAGE_TO_PROBABILITY[value.toLowerCase()];
        if (mappedProb !== undefined) {
          updated.probability = mappedProb;
        } else {
          updated.probability = 0;
        }
      }
      return updated;
    });
    setApiError(null);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const openCreateModal = () => {
    setIsViewOnlyModal(false);
    setEditingLeadId(null);
    setApiError(null);
    setTouched({});
    setDealCurrency('INR');
    setDealSelectedAmount('');
    const todayStr = new Date().toISOString().split('T')[0];
    const nextFollowupStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const closeDateStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const generatedId = generateNextLeadId(leads);

    setFormData({
      leadId: generatedId,
      dateCaptured: todayStr,
      leadName: '',
      jobTitle: '',
      companyName: '',
      email: '',
      phone: '',
      leadSource: '',
      serviceInterest: '',
      industry: '',
      companySize: '',
      pipelineStage: '',
      leadOwner: '',
      estimatedDealValue: '',
      probability: 0,
      expectedCloseDate: closeDateStr,
      lastContactDate: todayStr,
      nextFollowupDate: nextFollowupStr,
      followupNotes: '',
      status: '',
      lostReason: '',
      daysInPipeline: 0,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (lead: LeadItem) => {
    openEditModal(lead);
    setIsViewOnlyModal(true);
  };

  const openEditModal = (lead: LeadItem) => {
    setIsViewOnlyModal(false);
    const leadIdVal = lead.leadId || lead.id || '';
    setEditingLeadId(lead.id || leadIdVal);
    setApiError(null);
    setTouched({});
    setDealCurrency('INR');
    setDealSelectedAmount('');

    const dateCap = lead.dateCaptured ? toInputDateFormat(lead.dateCaptured) : (lead.createdAt ? toInputDateFormat(lead.createdAt) : new Date().toISOString().split('T')[0]);
    const capTime = new Date(dateCap).getTime();
    const calculatedDays = isNaN(capTime) ? 0 : Math.max(0, Math.floor((Date.now() - capTime) / (1000 * 3600 * 24)));

    setFormData({
      leadId: leadIdVal,
      dateCaptured: dateCap,
      leadName: lead.leadName || '',
      jobTitle: lead.jobTitle || '',
      companyName: lead.companyName || '',
      email: lead.email || lead.leadEmail || '',
      phone: lead.phone || lead.leadNumber || '',
      leadSource: lead.leadSource || lead.source || '',
      serviceInterest: lead.serviceInterest || lead.requirement || '',
      industry: lead.industry || '',
      companySize: lead.companySize || '',
      pipelineStage: lead.pipelineStage || lead.stage || lead.status || '',
      leadOwner: lead.leadOwner || lead.assignedSalesUser || '',
      estimatedDealValue: lead.estimatedDealValue || lead.estValue || '',
      probability: Number(lead.probability ?? 0),
      expectedCloseDate: lead.expectedCloseDate ? toInputDateFormat(lead.expectedCloseDate) : '',
      lastContactDate: lead.lastContactDate ? toInputDateFormat(lead.lastContactDate) : '',
      nextFollowupDate: lead.nextFollowupDate ? toInputDateFormat(lead.nextFollowupDate) : '',
      followupNotes: lead.followupNotes || lead.notes || lead.yetToCallNotes || '',
      status: lead.status || '',
      lostReason: lead.lostReason || '',
      daysInPipeline: lead.daysInPipeline !== undefined ? Number(lead.daysInPipeline) : calculatedDays,
    });
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete lead ${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/rest/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(item => item.id !== id));
        showToast(`Lead ${id} successfully deleted!`);
      } else {
        setLeads(prev => prev.filter(item => item.id !== id));
        showToast(`Lead ${id} removed locally.`);
      }
    } catch {
      setLeads(prev => prev.filter(item => item.id !== id));
      showToast(`Lead ${id} removed locally.`);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setTouched({
        leadName: true,
        companyName: true,
        email: true,
        phone: true,
        leadSource: true,
        pipelineStage: true,
      });
      return;
    }

    setIsSaving(true);
    setApiError(null);

    const capTime = new Date(formData.dateCaptured).getTime();
    const daysCalculated = isNaN(capTime) ? 0 : Math.max(0, Math.floor((Date.now() - capTime) / (1000 * 3600 * 24)));
    const targetLeadId = formData.leadId.trim() || editingLeadId || generateNextLeadId(leads);

    const initialReason = formData.serviceInterest || 'Initial Qualification & Discovery';
    const initialNotes = formData.followupNotes.trim() || 'Lead created. Awaiting initial outreach call.';
    const initialTimelineItem: FollowupTimelineItem = {
      id: 'FL-' + Date.now(),
      date: formData.lastContactDate || new Date().toISOString().split('T')[0],
      status: formData.status,
      callReason: initialReason,
      notes: initialNotes,
      createdAt: new Date().toISOString(),
      userName: formData.leadOwner || 'Aravind (Customer Care)',
    };

    const payload = {
      id: targetLeadId,
      leadId: targetLeadId,
      dateCaptured: formData.dateCaptured,
      leadName: formData.leadName.trim(),
      jobTitle: formData.jobTitle.trim() || undefined,
      companyName: formData.companyName.trim() || undefined,
      email: formData.email.trim() || undefined,
      leadEmail: formData.email.trim() || undefined,
      phone: formData.phone.trim(),
      leadNumber: formData.phone.trim(),
      leadSource: formData.leadSource || 'Website',
      source: formData.leadSource || 'Website',
      serviceInterest: formData.serviceInterest || undefined,
      requirement: formData.serviceInterest || undefined,
      industry: formData.industry || undefined,
      companySize: formData.companySize || undefined,
      pipelineStage: formData.pipelineStage || 'Attempted to Contact',
      stage: formData.pipelineStage || 'Attempted to Contact',
      leadOwner: formData.leadOwner || 'Aravind',
      assignedSalesUser: formData.leadOwner || 'Aravind',
      estimatedDealValue: formData.estimatedDealValue.trim() || undefined,
      estValue: formData.estimatedDealValue.trim() || undefined,
      probability: Number(formData.probability) || 0,
      expectedCloseDate: formData.expectedCloseDate || undefined,
      lastContactDate: formData.lastContactDate || undefined,
      nextFollowupDate: formData.nextFollowupDate || undefined,
      followupNotes: formData.followupNotes.trim() || undefined,
      notes: formData.followupNotes.trim() || undefined,
      status: formData.status || 'New',
      lostReason: formData.lostReason.trim() || undefined,
      daysInPipeline: formData.daysInPipeline !== '' && !isNaN(Number(formData.daysInPipeline)) ? Math.max(0, Number(formData.daysInPipeline)) : daysCalculated,
      isQualifiedLead: formData.status === 'Qualified' || ['SQL', 'Meeting Completed', 'Opportunity Identified', 'Proposal Sent', 'Negotiation', 'Closed and Waiting for Contact', 'Closed and Contract Signed', 'Won'].includes(formData.pipelineStage),
      followupStatus: editingLeadId ? undefined : (formData.status || 'New'),
      callReason: initialReason,
      yetToCallNotes: initialNotes,
    };

    try {
      if (editingLeadId) {
        // Update existing lead
        const res = await fetch(`/rest/leads/${editingLeadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = Array.isArray(errData.message)
            ? errData.message.join(', ')
            : errData.message || 'Failed to update lead on server.';
          throw new Error(errMsg);
        }

        const updatedLead: LeadItem = await res.json();
        setLeads(prev => prev.map(item => (item.id === editingLeadId ? { ...item, ...updatedLead, ...payload } : item)));
        showToast(`Lead ${editingLeadId} successfully updated!`);
      } else {
        // Create new lead
        const res = await fetch('/rest/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = Array.isArray(errData.message)
            ? errData.message.join(', ')
            : errData.message || 'Failed to create lead on server.';
          throw new Error(errMsg);
        }

        const createdLead: LeadItem = await res.json();
        setLeads(prev => [
          {
            ...createdLead,
            ...payload,
            followupHistory: [initialTimelineItem],
          },
          ...prev,
        ]);
        showToast(`🎉 Lead ${createdLead.leadId || createdLead.id || targetLeadId} created successfully!`);
      }

      // Refresh KPIs
      loadLeadsFromApi();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save lead failed:', err);
      setApiError(err.message || 'An error occurred while saving lead.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = () => {
    showToast('Ladera Technology import template ready! 4 sample records imported.');
  };

  const uniqueCompanies = useMemo(() => {
    const companies = leads.map(l => l.companyName).filter(name => name && typeof name === 'string' && name.trim() !== '');
    return Array.from(new Set(companies)).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const stage = lead.status || lead.stage || lead.pipelineStage;
      const matchesStage = selectedStage === 'All stages' || stage === selectedStage;
      const leadSrc = lead.leadSource || lead.source;
      const matchesSource = selectedSource === 'All sources' || leadSrc === selectedSource;
      const matchesCompany =
        selectedCompany === 'All companies' ||
        (lead.companyName || '').toLowerCase().trim() === selectedCompany.toLowerCase().trim();
      const leadOwn = lead.leadOwner || lead.assignedSalesUser;
      const matchesOwner =
        selectedOwner === 'All owners' ||
        (leadOwn || '').toLowerCase().trim() === selectedOwner.toLowerCase().trim();
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        (lead.id && lead.id.toLowerCase().includes(q)) ||
        (lead.leadId && lead.leadId.toLowerCase().includes(q)) ||
        (lead.leadName && lead.leadName.toLowerCase().includes(q)) ||
        (lead.jobTitle && lead.jobTitle.toLowerCase().includes(q)) ||
        (lead.companyName && lead.companyName.toLowerCase().includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.leadEmail && lead.leadEmail.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        (lead.leadNumber && lead.leadNumber.toLowerCase().includes(q)) ||
        (lead.leadSource && lead.leadSource.toLowerCase().includes(q)) ||
        (lead.source && lead.source.toLowerCase().includes(q)) ||
        (lead.serviceInterest && lead.serviceInterest.toLowerCase().includes(q)) ||
        (lead.industry && lead.industry.toLowerCase().includes(q)) ||
        (lead.pipelineStage && lead.pipelineStage.toLowerCase().includes(q)) ||
        (lead.leadOwner && lead.leadOwner.toLowerCase().includes(q)) ||
        (lead.status && lead.status.toLowerCase().includes(q));

      return matchesStage && matchesSource && matchesCompany && matchesOwner && matchesQuery;
    });
  }, [leads, selectedStage, selectedSource, selectedCompany, selectedOwner, searchQuery]);

  // Dynamic KPI counts - exact lead counts matching active leads list
  const totalOpenCount = leads.length;

  const sourceStats = useMemo(() => {
    const total = leads.length;
    const counts: Record<string, number> = {};

    leads.forEach(l => {
      const src = l.leadSource || l.source || 'Website';
      counts[src] = (counts[src] || 0) + 1;
    });

    ['Referral', 'Website', 'Cold Call', 'LinkedIn', 'Email Campaign', 'Partner', 'Trade Show / Event'].forEach(s => {
      if (counts[s] === undefined) counts[s] = 0;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topThree = sorted.slice(0, 3).map(([name, count]) => ({
      name,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
      meta: getSourceMeta(name),
    }));

    return topThree;
  }, [leads]);

  return (
    <>
      <PageTitle title="Leads — Ladera Technology" />
      <Container>
        {/* Toast Notification */}
        {toastMessage && (
          <ToastBanner isError={toastMessage.isError}>
            <span>{toastMessage.text}</span>
          </ToastBanner>
        )}

        {/* Header Section */}
        <HeaderSection>
          <TitleGroup>
            <Title>Leads</Title>
            <Subtitle>Capture, score and qualify — every source feeds one funnel.</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <PrimaryButton onClick={openCreateModal}>+ New lead</PrimaryButton>
          </HeaderActions>
        </HeaderSection>

        {/* 4 KPI Metric Cards */}
        <MetricsGrid>
          {/* Open Leads */}
          <MetricCard>
            <MetricCardHeader>
              <MetricIconContainer bg="rgba(37, 99, 235, 0.1)" color="#2563eb">
                <UsersIcon />
              </MetricIconContainer>
              <MetricValue>{totalOpenCount}</MetricValue>
            </MetricCardHeader>
            <MetricLabel>Open Leads</MetricLabel>
            <MetricFoot color="#10b981">
              <span>↑</span>
              <span>12% this week</span>
            </MetricFoot>
          </MetricCard>

          {/* Sources breakdown as per our sources */}
          {sourceStats.map((src, idx) => (
            <MetricCard key={src.name || idx}>
              <MetricCardHeader>
                <MetricIconContainer bg={src.meta.bg} color={src.meta.color}>
                  {src.meta.icon}
                </MetricIconContainer>
                <MetricValue>{src.pct}%</MetricValue>
              </MetricCardHeader>
              <MetricLabel>From {src.name}</MetricLabel>
              <MetricFoot color="#10b981">
                <span>↑</span>
                <span>{src.count} {src.count === 1 ? 'lead' : 'leads'} · {src.meta.tag}</span>
              </MetricFoot>
            </MetricCard>
          ))}
        </MetricsGrid>

        {/* Lead Pipeline Table Card */}
        <TableCard>
          <TableTopBar>
            <TableHeadingGroup>
              <TableIconContainer>
                <TrendingUpIcon />
              </TableIconContainer>
              <TableTitleGroup>
                <TableTitle>Lead pipeline</TableTitle>
                <TableSubtitle>All sources · Last 30 days</TableSubtitle>
              </TableTitleGroup>
            </TableHeadingGroup>

            <TableControls>
              <SearchInput
                type="text"
                placeholder="Search leads, ID, company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FilterSelect
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value)}
              >
                <option value="All stages">All stages</option>
                {PIPELINE_STAGE_OPTIONS.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </FilterSelect>
              <FilterSelect
                value={selectedSource}
                onChange={e => setSelectedSource(e.target.value)}
              >
                <option value="All sources">All sources</option>
                {LEAD_SOURCE_OPTIONS.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </FilterSelect>
              <FilterSelect
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
              >
                <option value="All companies">All companies</option>
                {uniqueCompanies.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </FilterSelect>
              <FilterSelect
                value={selectedOwner}
                onChange={e => setSelectedOwner(e.target.value)}
              >
                <option value="All owners">All owners</option>
                {LEAD_OWNER_OPTIONS.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </FilterSelect>
            </TableControls>
          </TableTopBar>

          <TableResponsive>
            <Table>
              <thead>
                  <tr>
                      <Th>Company Info</Th>
                      <Th>Lead Details</Th>
                        <Th>Pipeline Stage</Th>
                      <Th>Exp Close Date</Th>
                      <Th>Last Contact Date</Th>
                      <Th>Next Follow-up Date</Th>
                      <Th alignRight>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const leadOwnerName = lead.leadOwner || lead.assignedSalesUser;
  
                    const phoneNum = lead.phone || lead.leadNumber || '--';
                    const emailAddr = lead.email || lead.leadEmail || '--';
  
                    return (
                      <Tr key={lead.id || lead.leadId}>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ 
                              width: '42px', height: '42px', borderRadius: '50%', 
                              backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                            }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{lead.companyName || '--'}</span>
                              <span style={{ fontSize: '12.5px', color: '#64748b' }}>{lead.industry || '--'}</span>
                              <div style={{ height: '2px' }}></div>
                              <span style={{ fontWeight: 500, color: '#334155', fontSize: '13px' }}>{lead.leadName || '--'}</span>
                              {lead.jobTitle ? <span style={{ fontSize: '12px', color: '#94a3b8' }}>{lead.jobTitle}</span> : null}
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                            <LeadIdBadge>{lead.leadId || lead.id}</LeadIdBadge>
                            <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: '-2px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              {leadOwnerName}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 500 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              <span>{formatDateDisplay(lead.dateCaptured || lead.createdAt)}</span>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{ fontWeight: 500, color: '#0f172a' }}>{lead.pipelineStage || lead.stage || lead.status || '--'}</span>
                            <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                              {lead.probability || 0}%
                            </span>
                          </div>
                        </Td>

                          <Td>
                            {lead.expectedCloseDate ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>{formatDateDisplay(lead.expectedCloseDate)}</span>
                              </div>
                            ) : '-'}
                          </Td>
                          <Td>
                            {lead.lastContactDate ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>{formatDateDisplay(lead.lastContactDate)}</span>
                              </div>
                            ) : '-'}
                          </Td>
                        
                        <Td style={{ position: 'relative' }}>
                          <FollowupCellWrapper>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {lead.nextFollowupDate ? (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                  <span>{formatDateDisplay(lead.nextFollowupDate)}</span>
                                </>
                              ) : '-'}
                            </div>
                            <FollowupTriggerButton 
                              type="button"
                              data-followup-trigger="true"
                              onClick={(e) => handleOpenInlineFollowup(lead, e)}
                              title="Click to view timeline and edit follow-up"
                              style={{ marginLeft: '12px' }}
                            >
                              <span style={{ fontSize: '12px' }}>⏱️</span>
                            </FollowupTriggerButton>
                          </FollowupCellWrapper>
                        </Td>

                        <Td alignRight>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <SecondaryButton style={{ padding: '6px', color: '#0f172a', borderColor: '#e2e8f0', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openViewModal(lead)} title="View More">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              </SecondaryButton>
                              <SecondaryButton style={{ padding: '6px', color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openEditModal(lead)} title="Edit Lead">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                              </SecondaryButton>
                              <SecondaryButton style={{ padding: '6px', color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleDeleteLead(lead.id || lead.leadId)} title="Delete Lead">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </SecondaryButton>
                            </div>
                            <PrimaryButton style={{ padding: '6px 12px', fontSize: '12px', width: '100%', justifyContent: 'center' }} onClick={() => showToast('Converted to Deal!')}>
                              Convert to Deal
                            </PrimaryButton>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={21} style={{ textAlign: 'center', padding: '32px', color: '#6b7280', fontWeight: 600 }}>
                        No leads match your filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
            </Table>
          </TableResponsive>

          <TableFooter>
            <FooterCount>
              Showing 1-{filteredLeads.length} of {leads.length} leads
            </FooterCount>
            <PaginationNav>
              <PageBtn disabled title="Previous page">‹</PageBtn>
              <PageBtn active title="Page 1">1</PageBtn>
              <PageBtn disabled title="Next page">›</PageBtn>
            </PaginationNav>
            <PageSizeWrapper>
              <span>Rows per page:</span>
              <PageSizeSelect defaultValue="10">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </PageSizeSelect>
            </PageSizeWrapper>
          </TableFooter>
        </TableCard>

        {/* Centered Follow-up & Activity Timeline Modal */}
        {activeFollowupLeadId && (() => {
          const activeLead = leads.find(l => l.id === activeFollowupLeadId);
          if (!activeLead) return null;
          const currentStatus = extractFollowupStatus(activeLead);
          const timeline = (activeLead.followupHistory && activeLead.followupHistory.length > 0)
            ? activeLead.followupHistory
            : getLeadDefaultTimeline(activeLead);

          return (
            <FollowupModalOverlay onClick={handleCloseInlineFollowup}>
              <FollowupModalCard
                data-followup-popover="true"
                onClick={e => e.stopPropagation()}
              >
                <PopoverHeader>
                  <PopoverTitle>
                    <span>📅</span>
                    <span>Last Follow-up & Activity Timeline</span>
                  </PopoverTitle>
                  <PopoverCloseBtn
                    type="button"
                    onClick={handleCloseInlineFollowup}
                    title="Close"
                  >
                    ✕
                  </PopoverCloseBtn>
                </PopoverHeader>

                <div style={{ padding: '0 2px 4px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {activeLead.leadName}
                    {activeLead.jobTitle && (
                      <span style={{ fontWeight: 600, color: '#2563eb', marginLeft: '6px', fontSize: '12px' }}>
                        · {activeLead.jobTitle}
                      </span>
                    )}
                    {activeLead.companyName && (
                      <span style={{ fontWeight: 500, color: '#64748b', marginLeft: '6px', fontSize: '12px' }}>
                        ({activeLead.companyName})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {activeLead.leadNumber || activeLead.phone || ''}
                  </div>
                </div>

                <PopoverTabBar>
                  <PopoverTabItem
                    type="button"
                    active={popoverActiveTab === 'timeline'}
                    onClick={() => setPopoverActiveTab('timeline')}
                  >
                    <span>⏱️</span>
                    <span>Follow-up Timeline</span>
                    <PopoverTabBadge active={popoverActiveTab === 'timeline'}>
                      {timeline.length}
                    </PopoverTabBadge>
                  </PopoverTabItem>
                  <PopoverTabItem
                    type="button"
                    active={popoverActiveTab === 'followup'}
                    onClick={() => setPopoverActiveTab('followup')}
                  >
                    <span>📝</span>
                    <span>Last Follow-up</span>
                  </PopoverTabItem>
                </PopoverTabBar>

                {popoverActiveTab === 'followup' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Reason for this Call */}
                    <PopoverField>
                      <PopoverLabel htmlFor="followup-reason-select">
                        Reason for this Call
                      </PopoverLabel>
                      <PopoverSelect
                        id="followup-reason-select"
                        value={inlineCallReason}
                        onChange={e => setInlineCallReason(e.target.value)}
                      >
                        {CALL_REASON_OPTIONS.map(reason => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </PopoverSelect>
                    </PopoverField>

                    {/* Follow-up Date Input */}
                    <PopoverField>
                      <PopoverLabel htmlFor="followup-date-input">
                        Last Follow-up Date
                      </PopoverLabel>
                      <PopoverInput
                        id="followup-date-input"
                        type="date"
                        value={inlineDate}
                        onChange={e => setInlineDate(e.target.value)}
                      />
                    </PopoverField>

                    {/* Next Follow-up Date Input */}
                    <PopoverField>
                      <PopoverLabel htmlFor="next-followup-date-input">
                        Next Follow-up Date
                      </PopoverLabel>
                      <PopoverInput
                        id="next-followup-date-input"
                        type="date"
                        value={inlineNextDate}
                        onChange={e => setInlineNextDate(e.target.value)}
                      />
                    </PopoverField>

                    {/* Follow-up Status Dropdown */}
                    <PopoverField>
                      <PopoverLabel htmlFor="followup-status-select">
                        Last Follow-up Status
                      </PopoverLabel>
                      <PopoverSelect
                        id="followup-status-select"
                        value={inlineStatus}
                        onChange={e => setInlineStatus(e.target.value)}
                      >
                        <option value="">-- Select Status --</option>
                        {FOLLOWUP_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        {inlineStatus && !FOLLOWUP_STATUS_OPTIONS.includes(inlineStatus) && (
                          <option value={inlineStatus}>{inlineStatus}</option>
                        )}
                      </PopoverSelect>
                    </PopoverField>

                    {/* Notes / Remarks Text box directly below dropdown */}
                    <PopoverField>
                      <PopoverLabel htmlFor="followup-notes-textarea">
                        Call Remarks / Notes
                      </PopoverLabel>
                      <PopoverTextarea
                        id="followup-notes-textarea"
                        rows={3}
                        placeholder="Enter conversation summary, next steps, or remarks..."
                        value={inlineNotes}
                        onChange={e => setInlineNotes(e.target.value)}
                      />
                    </PopoverField>

                    {/* Action Buttons */}
                    <PopoverFooter>
                      <PopoverCancelBtn
                        type="button"
                        onClick={handleCloseInlineFollowup}
                        disabled={isSavingFollowup}
                      >
                        Cancel
                      </PopoverCancelBtn>
                      <PopoverSaveBtn
                        type="button"
                        onClick={() => handleSaveInlineFollowup(activeLead.id)}
                        disabled={isSavingFollowup}
                      >
                        {isSavingFollowup ? 'Saving...' : 'Save Last Follow-up'}
                      </PopoverSaveBtn>
                    </PopoverFooter>
                  </div>
                )}

                {popoverActiveTab === 'timeline' && (
                  <VertexTimelineContainer style={{ maxHeight: '420px', marginTop: '4px' }}>
                    <VertexSpineCap>
                      <VertexCapBadge>● Last Follow-up</VertexCapBadge>
                    </VertexSpineCap>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <VertexCentralAxis />
                      {timeline.map((item, idx) => {
                        const isLeft = idx % 2 === 0;
                        return (
                          <VertexTimelineRow key={item.id || idx}>
                            {/* Left Column */}
                            <VertexSideCol isLeft={true}>
                              {isLeft && (
                                <>
                                  <VertexMilestoneCard isLeft={true} statusType={item.status}>
                                    <VertexCardHeader>
                                      <FollowupStatusPill statusType={item.status}>
                                        {getStatusIcon(item.status)} {item.status}
                                      </FollowupStatusPill>
                                      <VertexDateBadge>{formatDateDisplay(item.date)}</VertexDateBadge>
                                    </VertexCardHeader>
                                    {item.callReason && (
                                      <VertexCallReasonTag title={`Call Reason: ${item.callReason}`}>
                                        🎯 {item.callReason}
                                      </VertexCallReasonTag>
                                    )}
                                    {item.notes && (
                                      <VertexNoteText title={item.notes}>{item.notes}</VertexNoteText>
                                    )}
                                    <VertexMetaRow>
                                      {item.userName || 'Customer Care Rep'}
                                      {item.createdAt && ` · ${formatRelativeTime(item.createdAt)}`}
                                    </VertexMetaRow>
                                  </VertexMilestoneCard>
                                  <VertexMarkerSquare statusType={item.status} title={`Status: ${item.status}`} />
                                  <VertexDottedLine />
                                </>
                              )}
                            </VertexSideCol>

                            {/* Center Spine Tick */}
                            <VertexCenterHub title={`Milestone #${timeline.length - idx}`}>
                              <VertexSpineTick />
                            </VertexCenterHub>

                            {/* Right Column */}
                            <VertexSideCol isLeft={false}>
                              {!isLeft && (
                                <>
                                  <VertexDottedLine />
                                  <VertexMarkerSquare statusType={item.status} title={`Status: ${item.status}`} />
                                  <VertexMilestoneCard isLeft={false} statusType={item.status}>
                                    <VertexCardHeader>
                                      <FollowupStatusPill statusType={item.status}>
                                        {getStatusIcon(item.status)} {item.status}
                                      </FollowupStatusPill>
                                      <VertexDateBadge>{formatDateDisplay(item.date)}</VertexDateBadge>
                                    </VertexCardHeader>
                                    {item.callReason && (
                                      <VertexCallReasonTag title={`Call Reason: ${item.callReason}`}>
                                        🎯 {item.callReason}
                                      </VertexCallReasonTag>
                                    )}
                                    {item.notes && (
                                      <VertexNoteText title={item.notes}>{item.notes}</VertexNoteText>
                                    )}
                                    <VertexMetaRow>
                                      {item.userName || 'Customer Care Rep'}
                                      {item.createdAt && ` · ${formatRelativeTime(item.createdAt)}`}
                                    </VertexMetaRow>
                                  </VertexMilestoneCard>
                                </>
                              )}
                            </VertexSideCol>
                          </VertexTimelineRow>
                        );
                      })}
                      {timeline.length === 0 && (
                        <TimelineEmptyText>
                          No prior follow-up activity logged yet.
                        </TimelineEmptyText>
                      )}
                    </div>
                    {timeline.length > 0 && (
                      <VertexSpineCap style={{ marginTop: '12px', marginBottom: '0' }}>
                        <VertexCapBadge>● Initial Project Inquiry</VertexCapBadge>
                      </VertexSpineCap>
                    )}
                  </VertexTimelineContainer>
                )}
              </FollowupModalCard>
            </FollowupModalOverlay>
          );
        })()}

        {/* Modal Dialog for Create & Edit Lead */}
        {isModalOpen && (
          <ModalOverlay onClick={() => !isSaving && setIsModalOpen(false)}>
            <ModalCard onClick={e => e.stopPropagation()}>
              <ModalHeaderBanner>
                <ModalHeaderTitleGroup>
                  <ModalHeaderTitle>
                    {isViewOnlyModal
                      ? `View Lead Details (${editingLeadId})`
                      : editingLeadId
                        ? `Edit Lead (${editingLeadId})`
                        : 'Create New Lead'}
                  </ModalHeaderTitle>
                  <ModalHeaderSubtitle>
                    Ladera Technology
                  </ModalHeaderSubtitle>
                </ModalHeaderTitleGroup>
                <ModalCloseButton
                  type="button"
                  onClick={() => !isSaving && setIsModalOpen(false)}
                >
                  ✕
                </ModalCloseButton>
              </ModalHeaderBanner>

              <ModalBody>
                {apiError && <ErrorBanner>{apiError}</ErrorBanner>}

                {isViewOnlyModal ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '20px' }}>
                    <FormSectionTitle><span>🧑</span><span>1. Lead & Contact Information</span></FormSectionTitle>
                    <FormGrid>
                      <ViewOnlyDetailItem label="Lead ID" value={formData.leadId} />
                      <ViewOnlyDetailItem label="Lead Name" value={formData.leadName} />
                      <ViewOnlyDetailItem label="Company Name" value={formData.companyName} />
                      <ViewOnlyDetailItem label="Job Title" value={formData.jobTitle} />
                      <ViewOnlyDetailItem label="Email" value={formData.email} />
                      <ViewOnlyDetailItem label="Phone Number" value={formData.phone} />
                      <ViewOnlyDetailItem label="Date Captured" value={formData.dateCaptured} />
                    </FormGrid>

                    <FormSectionTitle><span>🏢</span><span>2. Business & Profiling</span></FormSectionTitle>
                    <FormGrid>
                      <ViewOnlyDetailItem label="Lead Source" value={formData.leadSource} />
                      <ViewOnlyDetailItem label="Service Interest" value={formData.serviceInterest} />
                      <ViewOnlyDetailItem label="Industry" value={formData.industry} />
                      <ViewOnlyDetailItem label="Company Size" value={formData.companySize} />
                    </FormGrid>

                    <FormSectionTitle><span>📈</span><span>3. Deal & Pipeline Dynamics</span></FormSectionTitle>
                    <FormGrid>
                      <ViewOnlyDetailItem label="Pipeline Stage" value={formData.pipelineStage} />
                      <ViewOnlyDetailItem label="Probability in %" value={formData.probability ? `${formData.probability}%` : ''} />
                      <ViewOnlyDetailItem label="Lead Owner" value={formData.leadOwner} />
                      <ViewOnlyDetailItem label="Estimated Deal Value" value={formData.estimatedDealValue} />
                      <ViewOnlyDetailItem label="Expected Close Date" value={formData.expectedCloseDate} />
                      <ViewOnlyDetailItem label="Days in Pipeline" value={formData.daysInPipeline} />
                      <ViewOnlyDetailItem label="Status" value={formData.status} />
                      {formData.pipelineStage === 'Lost' && <ViewOnlyDetailItem label="Lost Reason" value={formData.lostReason} />}
                    </FormGrid>

                    <FormSectionTitle><span>📅</span><span>4. Follow-up & Activity Tracking</span></FormSectionTitle>
                    <FormGrid>
                      <ViewOnlyDetailItem label="Last Contact Date" value={formData.lastContactDate} />
                      <ViewOnlyDetailItem label="Next Follow-up Date" value={formData.nextFollowupDate} />
                      <ViewOnlyDetailItem label="Follow up Notes" value={formData.followupNotes} fullWidth />
                    </FormGrid>

                    <ModalActions style={{ marginTop: '10px' }}>
                      <SecondaryButton
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Close Details
                      </SecondaryButton>
                    </ModalActions>
                  </div>
                ) : (
                <form onSubmit={handleSaveLead} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <fieldset disabled={isViewOnlyModal} style={{ border: 'none', margin: 0, padding: 0 }}>
                    <FormGrid>
                      {/* SECTION 1: Lead & Contact Info */}
                      <FormSectionTitle>
                        <span>🧑</span>
                        <span>1. Lead & Contact Information</span>
                      </FormSectionTitle>

                    {/* Lead ID (Only when editing an existing lead, full-width so it doesn't displace grid) */}
                    {editingLeadId && (
                      <FormGroup fullWidth>
                        <FormLabel>
                          Lead ID <RequiredStar>*</RequiredStar>
                        </FormLabel>
                        <FormInput
                          name="leadId"
                          value={formData.leadId}
                          onChange={handleInputChange}
                          placeholder="e.g. LD-0001"
                          style={{ fontFamily: 'monospace', fontWeight: 700 }}
                        />
                      </FormGroup>
                    )}

                    {/* 1. Lead Name */}
                    <FormGroup>
                      <FormLabel>
                        Lead Name <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="leadName"
                        type="text"
                        value={formData.leadName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('leadName')}
                        placeholder="Enter lead name"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="words"
                        spellCheck={false}
                        data-lpignore="true"
                        data-form-type="other"
                        hasError={!!(touched.leadName && validationErrors.leadName)}
                      />
                      {touched.leadName && validationErrors.leadName && (
                        <FieldError>{validationErrors.leadName}</FieldError>
                      )}
                    </FormGroup>

                    {/* 2. Company Name */}
                    <FormGroup>
                      <FormLabel>
                        Company Name <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('companyName')}
                        placeholder="e.g. Acme Corp or Ladera Tech"
                        hasError={!!(touched.companyName && validationErrors.companyName)}
                      />
                      {touched.companyName && validationErrors.companyName && (
                        <FieldError>{validationErrors.companyName}</FieldError>
                      )}
                    </FormGroup>

                    {/* 3. Job Title */}
                    <FormGroup>
                      <FormLabel>Job Title</FormLabel>
                      <FormInput
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. CTO, IT Director, Tech Lead"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="words"
                        spellCheck={false}
                        data-lpignore="true"
                        data-form-type="other"
                      />
                    </FormGroup>

                    {/* 4. Date Captured */}
                    <FormGroup>
                      <FormLabel>
                        Date Captured <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="dateCaptured"
                        type="date"
                        value={formData.dateCaptured}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    {/* 5. Email */}
                    <FormGroup>
                      <FormLabel>
                        Email <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="lead_contact_electronic_address"
                        data-field="email"
                        type="text"
                        inputMode="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="Enter email address"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        data-lpignore="true"
                        data-form-type="other"
                        aria-autocomplete="none"
                        hasError={!!(touched.email && validationErrors.email)}
                      />
                      {touched.email && validationErrors.email && (
                        <FieldError>{validationErrors.email}</FieldError>
                      )}
                    </FormGroup>

                    {/* 6. Phone Number */}
                    <FormGroup>
                      <FormLabel>
                        Phone Number <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormInput
                        name="lead_contact_telephone_number"
                        data-field="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="e.g. +91 98765 43210"
                        autoComplete="off"
                        autoCorrect="off"
                        data-lpignore="true"
                        data-form-type="other"
                        hasError={!!(touched.phone && validationErrors.phone)}
                      />
                      {touched.phone && validationErrors.phone && (
                        <FieldError>{validationErrors.phone}</FieldError>
                      )}
                    </FormGroup>

                    {/* SECTION 2: Business & Profiling */}
                    <FormSectionTitle>
                      <span>🏢</span>
                      <span>2. Business & Profiling</span>
                    </FormSectionTitle>

                    {/* 7. Lead Source */}
                    <FormGroup>
                      <FormLabel>
                        Lead Source <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('leadSource')}
                        hasError={!!(touched.leadSource && validationErrors.leadSource)}
                      >
                        <option value="">-- Select Lead Source --</option>
                        {LEAD_SOURCE_OPTIONS.map(src => (
                          <option key={src} value={src}>{src}</option>
                        ))}
                      </FormSelect>
                      {touched.leadSource && validationErrors.leadSource && (
                        <FieldError>{validationErrors.leadSource}</FieldError>
                      )}
                    </FormGroup>

                    {/* 8. Service Interest (Multi-Select) */}
                    <FormGroup style={{ position: 'relative' }}>
                      <FormLabel>
                        Service Interest <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <MultiSelectContainer ref={serviceDropdownRef}>
                        <MultiSelectTrigger
                          isOpen={isServiceDropdownOpen}
                          onClick={() => setIsServiceDropdownOpen(prev => !prev)}
                        >
                          <MultiSelectChipsWrapper>
                            {selectedServices.length === 0 ? (
                              <MultiSelectPlaceholder>Select service interests...</MultiSelectPlaceholder>
                            ) : (
                              selectedServices.map(svc => (
                                <MultiSelectChip key={svc}>
                                  <span>{svc}</span>
                                  <ChipRemoveBtn
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleService(svc);
                                    }}
                                  >
                                    ✕
                                  </ChipRemoveBtn>
                                </MultiSelectChip>
                              ))
                            )}
                          </MultiSelectChipsWrapper>
                          <span style={{ fontSize: '11px', color: '#6b7280', flexShrink: 0 }}>
                            {isServiceDropdownOpen ? '▲' : '▼'}
                          </span>
                        </MultiSelectTrigger>

                        {isServiceDropdownOpen && (
                          <MultiSelectDropdown>
                            {SERVICE_INTEREST_OPTIONS.map(svc => {
                              const isChecked = selectedServices.includes(svc);
                              return (
                                <MultiSelectOption
                                  key={svc}
                                  isSelected={isChecked}
                                  onClick={() => handleToggleService(svc)}
                                >
                                  <MultiSelectCheckbox
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                  />
                                  <span>{svc}</span>
                                </MultiSelectOption>
                              );
                            })}
                          </MultiSelectDropdown>
                        )}
                      </MultiSelectContainer>
                    </FormGroup>

                    {/* 9. Industry */}
                    <FormGroup>
                      <FormLabel>
                        Industry <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Industry --</option>
                        {formData.industry && !INDUSTRY_OPTIONS.includes(formData.industry) && (
                          <option value={formData.industry}>{formData.industry}</option>
                        )}
                        {INDUSTRY_OPTIONS.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* 10. Company Size */}
                    <FormGroup>
                      <FormLabel>
                        Company Size <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Company Size --</option>
                        {COMPANY_SIZE_OPTIONS.map(sz => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* SECTION 3: Deal & Pipeline Dynamics */}
                    <FormSectionTitle>
                      <span>📊</span>
                      <span>3. Deal & Pipeline Dynamics</span>
                    </FormSectionTitle>

                    {/* 11. Pipeline Stage */}
                    <FormGroup>
                      <FormLabel>
                        Pipeline Stage <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="pipelineStage"
                        value={formData.pipelineStage}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('pipelineStage')}
                        hasError={!!(touched.pipelineStage && validationErrors.pipelineStage)}
                      >
                        <option value="">-- Select Pipeline Stage --</option>
                        {formData.pipelineStage && !PIPELINE_STAGE_OPTIONS.includes(formData.pipelineStage) && (
                          <option value={formData.pipelineStage}>{formData.pipelineStage}</option>
                        )}
                        {PIPELINE_STAGE_OPTIONS.map(stg => (
                          <option key={stg} value={stg}>{stg}</option>
                        ))}
                      </FormSelect>
                      {touched.pipelineStage && validationErrors.pipelineStage && (
                        <FieldError>{validationErrors.pipelineStage}</FieldError>
                      )}
                    </FormGroup>

                    {/* 12. Probability in % (Near Pipeline Stage) */}
                    <FormGroup>
                      <FormLabel>
                        Probability in %
                      </FormLabel>
                      <FormSelect
                        name="probability"
                        value={formData.probability}
                        onChange={handleInputChange}
                      >
                        {PROBABILITY_OPTIONS.map(prob => (
                          <option key={prob} value={prob}>{prob}%</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* 13. Lead Owner */}
                    <FormGroup>
                      <FormLabel>
                        Lead Owner <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="leadOwner"
                        value={formData.leadOwner}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Lead Owner --</option>
                        {formData.leadOwner && !LEAD_OWNER_OPTIONS.includes(formData.leadOwner) && (
                          <option value={formData.leadOwner}>{formData.leadOwner}</option>
                        )}
                        {LEAD_OWNER_OPTIONS.map(owner => (
                          <option key={owner} value={owner}>{owner}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* 14. Estimated Deal Value (INR & AED dropdown with Auto USD Conversion) */}
                    <FormGroup>
                      <FormLabel>
                        Estimated Deal Value
                        <span style={{ marginLeft: '6px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                          (Select INR or AED · Auto-converts to USD)
                        </span>
                      </FormLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px' }}>
                        <FormSelect
                          value={dealCurrency}
                          onChange={(e) => handleDealCurrencyChange(e.target.value as 'INR' | 'AED')}
                          style={{ fontWeight: 600 }}
                        >
                          <option value="INR">🇮🇳 INR (₹)</option>
                          <option value="AED">🇦🇪 AED (AED)</option>
                        </FormSelect>
                        <FormSelect
                          value={dealSelectedAmount}
                          onChange={(e) => handleDealAmountChange(e.target.value)}
                        >
                          <option value="">-- Select Deal Value ({dealCurrency}) --</option>
                          {dealCurrency === 'INR'
                            ? INR_DEAL_VALUE_OPTIONS.map(opt => (
                                <option key={opt.amount} value={opt.amount}>
                                  {opt.label}
                                </option>
                              ))
                            : AED_DEAL_VALUE_OPTIONS.map(opt => (
                                <option key={opt.amount} value={opt.amount}>
                                  {opt.label}
                                </option>
                              ))}
                        </FormSelect>
                      </div>
                      {formData.estimatedDealValue && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '6px',
                            padding: '8px 12px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            color: '#065f46',
                          }}
                        >
                          <span style={{ fontSize: '15px' }}>💵</span>
                          <span style={{ fontWeight: 600 }}>Est US Dollars:</span>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '13px',
                              color: '#047857',
                              background: '#d1fae5',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {formData.estimatedDealValue} USD
                          </span>
                          {dealSelectedAmount && (
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>
                              (from {dealCurrency === 'INR' ? '₹' : 'AED '}
                              {Number(dealSelectedAmount).toLocaleString()})
                            </span>
                          )}
                        </div>
                      )}
                    </FormGroup>

                    {/* 15. Exp Close Date */}
                    <FormGroup>
                      <FormLabel>Exp Close Date</FormLabel>
                      <FormInput
                        name="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    {/* 20. Days in Pipeline */}
                    <FormGroup>
                      <FormLabel>
                        Days in Pipeline
                      </FormLabel>
                      <FormInput
                        name="daysInPipeline"
                        type="number"
                        min="0"
                        value={formData.daysInPipeline}
                        onChange={handleInputChange}
                        placeholder="e.g. 15"
                      />
                    </FormGroup>

                    {/* SECTION 4: Follow-up, Status & Notes */}
                    <FormSectionTitle>
                      <span>📅</span>
                      <span>4. Follow-up, Status & Notes</span>
                    </FormSectionTitle>

                    {/* 16. Last Contact Date */}
                    <FormGroup>
                      <FormLabel>Last Contact Date</FormLabel>
                      <FormInput
                        name="lastContactDate"
                        type="date"
                        value={formData.lastContactDate}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    {/* 17. Next Follow-up Date */}
                    <FormGroup>
                      <FormLabel>Next Follow-up Date</FormLabel>
                      <FormInput
                        name="nextFollowupDate"
                        type="date"
                        value={formData.nextFollowupDate}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    {/* 18. Status */}
                    <FormGroup>
                      <FormLabel>
                        Status <RequiredStar>*</RequiredStar>
                      </FormLabel>
                      <FormSelect
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Status --</option>
                        {STATUS_OPTIONS.map(stat => (
                          <option key={stat} value={stat}>{stat}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>

                    {/* 19. Lost Reason */}
                    {formData.pipelineStage === 'Lost' && (
                      <FormGroup fullWidth>
                        <FormLabel>Lost Reason</FormLabel>
                        <FormInput
                          name="lostReason"
                          value={formData.lostReason}
                          onChange={handleInputChange}
                          placeholder="Enter reason if lost or cold (e.g. Budget constraint, Competitor chosen)..."
                        />
                      </FormGroup>
                    )}

                    {/* 17. Follow up Notes */}
                    <FormGroup fullWidth>
                      <FormLabel>Follow up Notes</FormLabel>
                      <FormTextarea
                        name="followupNotes"
                        rows={3}
                        value={formData.followupNotes}
                        onChange={handleInputChange}
                        placeholder="Enter latest conversation notes, customer requirements, plywood grade preferences, or delivery timelines..."
                      />
                    </FormGroup>
                    </FormGrid>
                  </fieldset>

                  <ModalActions>
                    <SecondaryButton
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsModalOpen(false)}
                    >
                      {isViewOnlyModal ? 'Close' : 'Cancel'}
                    </SecondaryButton>
                    {!isViewOnlyModal && (
                      <PrimaryButton type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving Lead...' : editingLeadId ? 'Update Lead' : 'Save Lead'}
                      </PrimaryButton>
                    )}
                  </ModalActions>
                </form>
                )}
              </ModalBody>
            </ModalCard>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
};

export default LeadsPage;
