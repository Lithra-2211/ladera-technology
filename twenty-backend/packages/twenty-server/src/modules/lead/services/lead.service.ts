import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

import { CreateLeadDto } from '../dtos/create-lead.dto';
import { UpdateLeadDto } from '../dtos/update-lead.dto';

export interface LeadEntity {
  id: string;
  leadId?: string;
  dateCaptured: string | null;
  leadName: string;
  jobTitle?: string | null;
  companyName: string | null;
  leadEmail: string | null;
  email: string | null;
  leadNumber: string;
  phone: string | null;
  leadSource: string;
  source: string;
  serviceInterest: string | null;
  industry: string | null;
  companySize: string | null;
  pipelineStage: string;
  stage: string;
  leadOwner: string;
  assignedSalesUser: string;
  estimatedDealValue: string | null;
  estValue: string;
  probability: number;
  expectedCloseDate: string | null;
  lastContactDate: string | null;
  nextFollowupDate: string | null;
  followupNotes: string | null;
  notes: string | null;
  status: string;
  lostReason: string | null;
  daysInPipeline: number;
  isQualifiedLead: boolean;
  followupStatus?: string | null;
  callReason?: string | null;
  yetToCallNotes?: string | null;
  requirement?: string;
  score?: 'A' | 'B';
  avatarTone: 'violet' | 'teal' | 'amber' | 'slate' | 'brand';
  initials: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadKpis {
  totalOpenLeads: number;
  openLeadsGrowth: string;
  websitePercentage: number;
  whatsappPercentage: number;
  phonePercentage: number;
}

const INITIAL_CENTURY_PLY_LEADS: LeadEntity[] = [
  {
    id: 'LD-3311',
    leadName: 'Kavitha M.',
    leadNumber: '+91 98451 22310',
    leadEmail: 'kavitha.m@gmail.com',
    leadSource: 'Website',
    isQualifiedLead: false,
    status: 'New',
    nextFollowupDate: '2026-09-12',
    followupStatus: 'Yet to Call',
    assignedSalesUser: 'Priya Sharma',
    companyName: null,
    email: 'kavitha.m@gmail.com',
    phone: '+91 98451 22310',
    source: 'Website',
    requirement: 'Sofa set · 3+1+1',
    estValue: '₹68K',
    score: 'B',
    stage: 'New',
    notes: 'Inquired via web catalog for living room sofa set.',
    avatarTone: 'violet',
    initials: 'KM',
    createdAt: new Date('2026-09-01T10:00:00Z'),
    updatedAt: new Date('2026-09-01T10:00:00Z'),
  },
  {
    id: 'LD-3308',
    leadName: 'Sundar Interiors',
    leadNumber: '+91 98840 91823',
    leadEmail: 'contact@sundarinteriors.in',
    leadSource: 'WhatsApp',
    isQualifiedLead: true,
    status: 'Qualified',
    nextFollowupDate: '2026-09-14',
    followupStatus: 'Connected',
    assignedSalesUser: 'Vikram Malhotra',
    companyName: 'Sundar Interior Solutions',
    email: 'contact@sundarinteriors.in',
    phone: '+91 98840 91823',
    source: 'WhatsApp',
    requirement: 'Office furniture · 40 seats',
    estValue: '₹4.8L',
    score: 'A',
    stage: 'Qualified',
    notes: 'Commercial fit-out project. Requested Century Club Prime sheets and modular desks.',
    avatarTone: 'teal',
    initials: 'SI',
    createdAt: new Date('2026-09-02T11:30:00Z'),
    updatedAt: new Date('2026-09-02T11:30:00Z'),
  },
  {
    id: 'LD-3302',
    leadName: 'Ravi S.',
    leadNumber: '+91 97112 34567',
    leadEmail: 'ravi.sharma@yahoo.com',
    leadSource: 'Phone',
    isQualifiedLead: false,
    status: 'Contacted',
    nextFollowupDate: '2026-09-11',
    followupStatus: 'Rescheduled',
    assignedSalesUser: 'Amit Patel',
    companyName: null,
    email: 'ravi.sharma@yahoo.com',
    phone: '+91 97112 34567',
    source: 'Phone',
    requirement: 'Beds ×2 · engineered wood',
    estValue: '₹1.1L',
    score: 'A',
    stage: 'Contacted',
    notes: 'Customer called helpline for customized master bedroom king size bed.',
    avatarTone: 'amber',
    initials: 'RS',
    createdAt: new Date('2026-09-03T09:15:00Z'),
    updatedAt: new Date('2026-09-03T09:15:00Z'),
  },
  {
    id: 'LD-3299',
    leadName: 'GreenNest Villas',
    leadNumber: '+91 80234 56789',
    leadEmail: 'procurement@greennest.com',
    leadSource: 'Website',
    isQualifiedLead: true,
    status: 'Qualified',
    nextFollowupDate: '2026-09-16',
    followupStatus: 'Connected',
    assignedSalesUser: 'Sneha Rao',
    companyName: 'GreenNest Realty Ltd',
    email: 'procurement@greennest.com',
    phone: '+91 80234 56789',
    source: 'Website',
    requirement: 'Full-home furniture · 12 villas',
    estValue: '₹18.5L',
    score: 'A',
    stage: 'Qualified',
    notes: 'Premium gated community villa project. High priority enterprise lead.',
    avatarTone: 'teal',
    initials: 'GV',
    createdAt: new Date('2026-09-04T14:20:00Z'),
    updatedAt: new Date('2026-09-04T14:20:00Z'),
  },
  {
    id: 'LD-3291',
    leadName: 'Faisal A.',
    leadNumber: '+91 99001 12233',
    leadEmail: 'faisal.ahmed@outlook.com',
    leadSource: 'Walk-in',
    isQualifiedLead: false,
    status: 'Cold',
    nextFollowupDate: '2026-09-20',
    followupStatus: 'RNR (Ring No Response)',
    assignedSalesUser: 'Arun Joshi',
    companyName: null,
    email: 'faisal.ahmed@outlook.com',
    phone: '+91 99001 12233',
    source: 'Walk-in',
    requirement: 'Dining set · 6 seater',
    estValue: '₹54K',
    score: 'B',
    stage: 'Cold',
    notes: 'Visited Century showroom in Indiranagar. Looking for budget teak dining set.',
    avatarTone: 'slate',
    initials: 'FA',
    createdAt: new Date('2026-09-05T16:45:00Z'),
    updatedAt: new Date('2026-09-05T16:45:00Z'),
  },
  {
    id: 'LD-3287',
    leadName: 'Lakshmi Builders',
    leadNumber: '+91 94440 88776',
    leadEmail: 'info@lakshmibuilders.org',
    leadSource: 'Phone',
    isQualifiedLead: true,
    status: 'Contacted',
    nextFollowupDate: '2026-09-13',
    followupStatus: 'Not Reachable',
    assignedSalesUser: 'Vikram Malhotra',
    companyName: 'Lakshmi Construction Corp',
    email: 'info@lakshmibuilders.org',
    phone: '+91 94440 88776',
    source: 'Phone',
    requirement: 'Site office furniture',
    estValue: '₹5.6L',
    score: 'A',
    stage: 'Contacted',
    notes: 'Site office cabins and workstation setup for ongoing tech park build.',
    avatarTone: 'amber',
    initials: 'LB',
    createdAt: new Date('2026-09-06T12:00:00Z'),
    updatedAt: new Date('2026-09-06T12:00:00Z'),
  },
];

@Injectable()
export class LeadService implements OnModuleInit {
  private readonly logger = new Logger(LeadService.name);
  private readonly pool: Pool;
  private leadsStore: LeadEntity[] = [...INITIAL_CENTURY_PLY_LEADS];

  constructor() {
    const rawUrl =
      process.env.PG_DATABASE_URL ||
      'postgres://twenty:twenty@localhost:5435/default';
    const connectionString = rawUrl.replace('localhost', '127.0.0.1');
    this.pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
    });
  }

  async onModuleInit() {
    // Run DB initialization asynchronously without blocking server bootstrap
    void this.initDb();
  }

  private async initDb() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS public."LEAD" (
          "Lead_Id" VARCHAR(64) PRIMARY KEY,
          "Lead_Name" VARCHAR(255) NOT NULL,
          "Lead_Number" VARCHAR(50) NOT NULL,
          "Lead_Email" VARCHAR(255),
          "Lead_Source" VARCHAR(50) NOT NULL DEFAULT 'Website',
          "Is_Qualified_Lead" BOOLEAN NOT NULL DEFAULT FALSE,
          "Status" VARCHAR(50) NOT NULL DEFAULT 'New',
          "Next_Followup_Date" TIMESTAMPTZ,
          "Assigned_Sales_User" VARCHAR(255),
          "Company_Name" VARCHAR(255),
          "Requirement" TEXT,
          "Est_Value" VARCHAR(50),
          "Score" VARCHAR(10),
          "Notes" TEXT,
          "Avatar_Tone" VARCHAR(50),
          "Initials" VARCHAR(10),
          "Created_At" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "Updated_At" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await this.pool.query(`
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Followup_Status" VARCHAR(100);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Call_Reason" VARCHAR(255);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Yet_To_Call_Notes" TEXT;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Date_Captured" TIMESTAMPTZ;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Service_Interest" VARCHAR(255);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Industry" VARCHAR(255);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Company_Size" VARCHAR(100);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Pipeline_Stage" VARCHAR(100);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Lead_Owner" VARCHAR(255);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Estimated_Deal_Value" VARCHAR(100);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Probability" INT;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Expected_Close_Date" TIMESTAMPTZ;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Last_Contact_Date" TIMESTAMPTZ;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Followup_Notes" TEXT;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Lost_Reason" VARCHAR(255);
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Days_In_Pipeline" INT;
        ALTER TABLE public."LEAD" ADD COLUMN IF NOT EXISTS "Job_Title" VARCHAR(255);
      `);

      const checkRes = await this.pool.query('SELECT COUNT(*) FROM public."LEAD"');
      if (parseInt(checkRes.rows[0]?.count || '0', 10) === 0) {
        for (const lead of INITIAL_CENTURY_PLY_LEADS) {
          await this.pool.query(
            `INSERT INTO public."LEAD" (
              "Lead_Id", "Lead_Name", "Lead_Number", "Lead_Email", "Lead_Source",
              "Is_Qualified_Lead", "Status", "Next_Followup_Date", "Assigned_Sales_User",
              "Company_Name", "Requirement", "Est_Value", "Score", "Notes",
              "Avatar_Tone", "Initials", "Followup_Status", "Created_At", "Updated_At"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            ON CONFLICT ("Lead_Id") DO NOTHING;`,
            [
              lead.id,
              lead.leadName,
              lead.leadNumber,
              lead.leadEmail,
              lead.leadSource,
              lead.isQualifiedLead,
              lead.status,
              lead.nextFollowupDate ? new Date(lead.nextFollowupDate) : null,
              lead.assignedSalesUser || null,
              lead.companyName || null,
              lead.requirement,
              lead.estValue,
              lead.score,
              lead.notes || null,
              lead.avatarTone,
              lead.initials,
              lead.followupStatus || null,
              lead.createdAt,
              lead.updatedAt,
            ],
          );
        }
      }
      this.logger.log('PostgreSQL "LEAD" table verified and ready.');
    } catch (err) {
      this.logger.warn('Non-fatal: Background DB init check warning:', err);
    }
  }

  private mapRowToEntity(row: any): LeadEntity {
    const id = row.Lead_Id || row.id;
    const leadName = row.Lead_Name || row.leadName || 'Unknown';
    const leadNumber = row.Lead_Number || row.leadNumber || row.phone || '';
    const leadEmail = row.Lead_Email || row.leadEmail || row.email || null;
    const source = (row.Lead_Source || row.leadSource || row.source || 'Website') as any;
    const isQualified = Boolean(row.Is_Qualified_Lead ?? row.isQualifiedLead);
    const status = (row.Status || row.status || row.stage || 'New') as any;
    const followupDate = row.Next_Followup_Date
      ? new Date(row.Next_Followup_Date).toISOString().split('T')[0]
      : (row.nextFollowupDate || null);
    const followupStatus = row.Followup_Status || row.followupStatus || null;
    const callReason = row.Call_Reason || row.callReason || null;
    const yetToCallNotes = row.Yet_To_Call_Notes || row.yetToCallNotes || null;
    const salesUser = row.Assigned_Sales_User || row.assignedSalesUser || row.Lead_Owner || row.leadOwner || 'Priya Sharma';

    const dateCaptured = row.Date_Captured
      ? new Date(row.Date_Captured).toISOString().split('T')[0]
      : (row.dateCaptured || (row.Created_At ? new Date(row.Created_At).toISOString().split('T')[0] : '2026-09-01'));
    const serviceInterest = row.Service_Interest || row.serviceInterest || row.Requirement || row.requirement || 'Century Plywood Solutions';
    const industry = row.Industry || row.industry || 'Architecture & Interior Design';
    const companySize = row.Company_Size || row.companySize || '11-50 Employees';
    const pipelineStage = row.Pipeline_Stage || row.pipelineStage || status || 'New';
    const leadOwner = row.Lead_Owner || row.leadOwner || salesUser;
    const estimatedDealValue = row.Estimated_Deal_Value || row.estimatedDealValue || row.Est_Value || row.estValue || '₹2.5L';
    const probability = Number(row.Probability ?? row.probability ?? 50);
    const expectedCloseDate = row.Expected_Close_Date
      ? new Date(row.Expected_Close_Date).toISOString().split('T')[0]
      : (row.expectedCloseDate || null);
    const lastContactDate = row.Last_Contact_Date
      ? new Date(row.Last_Contact_Date).toISOString().split('T')[0]
      : (row.lastContactDate || followupDate || null);
    const followupNotes = row.Followup_Notes || row.followupNotes || row.Notes || row.notes || null;
    const lostReason = row.Lost_Reason || row.lostReason || null;

    const capturedTime = new Date(dateCaptured).getTime();
    const nowTime = new Date().getTime();
    const calculatedDays = isNaN(capturedTime) ? 0 : Math.max(0, Math.floor((nowTime - capturedTime) / (1000 * 3600 * 24)));
    const daysInPipeline = Number(row.Days_In_Pipeline ?? row.daysInPipeline ?? calculatedDays);

    return {
      id,
      leadId: id,
      dateCaptured,
      leadName,
      jobTitle: row.Job_Title || row.jobTitle || null,
      companyName: row.Company_Name || row.companyName || null,
      leadEmail,
      email: leadEmail,
      leadNumber,
      phone: leadNumber,
      leadSource: source,
      source,
      serviceInterest,
      industry,
      companySize,
      pipelineStage,
      stage: pipelineStage,
      leadOwner,
      assignedSalesUser: leadOwner,
      estimatedDealValue,
      estValue: estimatedDealValue,
      probability,
      expectedCloseDate,
      lastContactDate,
      nextFollowupDate: followupDate,
      followupNotes,
      notes: followupNotes,
      status,
      lostReason,
      daysInPipeline,
      isQualifiedLead: isQualified,
      followupStatus,
      callReason,
      yetToCallNotes,
      requirement: serviceInterest,
      score: (row.Score || row.score || 'A') as any,
      avatarTone: (row.Avatar_Tone || row.avatarTone || 'brand') as any,
      initials: row.Initials || row.initials || 'CP',
      createdAt: row.Created_At ? new Date(row.Created_At) : new Date(),
      updatedAt: row.Updated_At ? new Date(row.Updated_At) : new Date(),
    };
  }

  private computeInitials(name: string): string {
    if (!name || !name.trim()) {
      return 'CP';
    }

    const cleaned = name.trim().replace(/[^a-zA-Z0-9\s]/g, ' ');
    const parts = cleaned.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  private assignAvatarTone(
    source: string,
    initials: string,
  ): 'violet' | 'teal' | 'amber' | 'slate' | 'brand' {
    switch (source) {
      case 'WhatsApp':
        return 'teal';
      case 'Phone':
        return 'amber';
      case 'Walk-in':
        return 'slate';
      case 'Website': {
        const charCode = (initials.charCodeAt(0) || 0) % 2;
        return charCode === 0 ? 'violet' : 'teal';
      }
      default:
        return 'brand';
    }
  }

  private formatEstValue(val: string): string {
    if (!val) return '₹1.0L';

    let cleaned = val.trim();
    cleaned = cleaned.replace(/^[₹?RsINR\s]+/, '').trim();
    return `₹${cleaned}`;
  }

  private calculateScore(
    estValue: string,
    requirement: string,
    providedScore?: 'A' | 'B',
  ): 'A' | 'B' {
    if (providedScore) {
      return providedScore;
    }

    const lowerReq = (requirement || '').toLowerCase();
    const lowerVal = (estValue || '').toLowerCase();

    if (
      lowerVal.includes('cr') ||
      lowerVal.includes('l') ||
      lowerReq.includes('office') ||
      lowerReq.includes('villa') ||
      lowerReq.includes('commercial') ||
      lowerReq.includes('bulk') ||
      lowerReq.includes('seats')
    ) {
      if (lowerVal.includes('0.') && !lowerVal.includes('cr')) {
        return 'B';
      }
      return 'A';
    }

    const num = parseInt(lowerVal.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num >= 100000) {
      return 'A';
    }

    return 'B';
  }

  private async generateNextLeadId(): Promise<string> {
    try {
      const res = await this.pool.query('SELECT "Lead_Id" FROM public."LEAD"');
      let maxNum = 3311;
      for (const row of res.rows) {
        const match = (row.Lead_Id || '').match(/^LD-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      }
      return `LD-${maxNum + 1}`;
    } catch {
      return `LD-${Date.now().toString().slice(-4)}`;
    }
  }

  async findAll(): Promise<LeadEntity[]> {
    try {
      const res = await this.pool.query(
        'SELECT * FROM public."LEAD" ORDER BY "Created_At" DESC',
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows.map(row => this.mapRowToEntity(row));
      }
    } catch (err) {
      this.logger.warn('Failed to fetch from public.LEAD, using fallback cache:', err);
    }
    return [...this.leadsStore];
  }

  async findOne(id: string): Promise<LeadEntity> {
    try {
      const res = await this.pool.query(
        'SELECT * FROM public."LEAD" WHERE LOWER("Lead_Id") = LOWER($1)',
        [id],
      );
      if (res.rows && res.rows.length > 0) {
        return this.mapRowToEntity(res.rows[0]);
      }
    } catch (err) {
      this.logger.warn(`Failed to find lead ${id} in database:`, err);
    }

    const lead = this.leadsStore.find(l => l.id.toLowerCase() === id.toLowerCase());
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async create(createLeadDto: CreateLeadDto): Promise<LeadEntity> {
    const nextId = createLeadDto.leadId?.trim() || await this.generateNextLeadId();
    const initials = this.computeInitials(createLeadDto.leadName);
    const source = createLeadDto.leadSource || createLeadDto.source || 'Website';
    const avatarTone = this.assignAvatarTone(source, initials);
    const formattedVal = this.formatEstValue(createLeadDto.estimatedDealValue || createLeadDto.estValue || '₹2.5L');
    const stage = createLeadDto.pipelineStage || createLeadDto.status || createLeadDto.stage || 'New';
    const leadNumber = createLeadDto.leadNumber?.trim() || createLeadDto.phone?.trim() || '+91 98000 00000';
    const leadEmail = createLeadDto.leadEmail?.trim() || createLeadDto.email?.trim() || null;
    const isQualified = createLeadDto.isQualifiedLead !== undefined
      ? createLeadDto.isQualifiedLead
      : (stage === 'Qualified' || stage === 'Closed Won');
    const followupDate = createLeadDto.nextFollowupDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    const followupStatus = createLeadDto.followupStatus?.trim() || 'Yet to Call';
    const callReason = createLeadDto.callReason?.trim() || 'Initial Qualification & Discovery';
    const yetToCallNotes = createLeadDto.yetToCallNotes?.trim() || null;
    const salesUser = createLeadDto.leadOwner?.trim() || createLeadDto.assignedSalesUser?.trim() || 'Priya Sharma';

    const dateCaptured = createLeadDto.dateCaptured?.trim() || new Date().toISOString().split('T')[0];
    const serviceInterest = createLeadDto.serviceInterest?.trim() || createLeadDto.requirement?.trim() || 'Century Plywood Solutions';
    const industry = createLeadDto.industry?.trim() || 'Architecture & Interior Design';
    const companySize = createLeadDto.companySize?.trim() || '11-50 Employees';
    const pipelineStage = stage;
    const leadOwner = salesUser;
    const estimatedDealValue = formattedVal;
    const probability = Number(createLeadDto.probability ?? 50);
    const expectedCloseDate = createLeadDto.expectedCloseDate?.trim() || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const lastContactDate = createLeadDto.lastContactDate?.trim() || dateCaptured;
    const followupNotes = createLeadDto.followupNotes?.trim() || createLeadDto.notes?.trim() || null;
    const status = createLeadDto.status?.trim() || 'Active';
    const lostReason = createLeadDto.lostReason?.trim() || null;

    const capturedTime = new Date(dateCaptured).getTime();
    const nowTime = new Date().getTime();
    const calculatedDays = isNaN(capturedTime) ? 0 : Math.max(0, Math.floor((nowTime - capturedTime) / (1000 * 3600 * 24)));
    const daysInPipeline = Number(createLeadDto.daysInPipeline ?? calculatedDays);

    const newLead: LeadEntity = {
      id: nextId,
      leadId: nextId,
      dateCaptured,
      leadName: createLeadDto.leadName.trim(),
      jobTitle: createLeadDto.jobTitle?.trim() || null,
      companyName: createLeadDto.companyName?.trim() || null,
      leadEmail,
      email: leadEmail,
      leadNumber,
      phone: leadNumber,
      leadSource: source,
      source,
      serviceInterest,
      industry,
      companySize,
      pipelineStage,
      stage: pipelineStage,
      leadOwner,
      assignedSalesUser: leadOwner,
      estimatedDealValue,
      estValue: estimatedDealValue,
      probability,
      expectedCloseDate,
      lastContactDate,
      nextFollowupDate: followupDate,
      followupNotes,
      notes: followupNotes,
      status,
      lostReason,
      daysInPipeline,
      isQualifiedLead: isQualified,
      followupStatus,
      callReason,
      yetToCallNotes,
      requirement: serviceInterest,
      score: 'A',
      avatarTone,
      initials,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save directly to PostgreSQL database table public."LEAD"
    try {
      const insertQuery = `
        INSERT INTO public."LEAD" (
          "Lead_Id", "Lead_Name", "Lead_Number", "Lead_Email", "Lead_Source",
          "Is_Qualified_Lead", "Status", "Next_Followup_Date", "Assigned_Sales_User",
          "Company_Name", "Requirement", "Est_Value", "Score", "Notes",
          "Avatar_Tone", "Initials", "Followup_Status", "Call_Reason", "Yet_To_Call_Notes",
          "Date_Captured", "Service_Interest", "Industry", "Company_Size", "Pipeline_Stage",
          "Lead_Owner", "Estimated_Deal_Value", "Probability", "Expected_Close_Date",
          "Last_Contact_Date", "Followup_Notes", "Lost_Reason", "Days_In_Pipeline",
          "Created_At", "Updated_At", "Job_Title"
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24,
          $25, $26, $27, $28,
          $29, $30, $31, $32,
          $33, $34, $35
        )
        RETURNING *;
      `;
      const values = [
        newLead.id,
        newLead.leadName,
        newLead.leadNumber,
        newLead.leadEmail,
        newLead.leadSource,
        newLead.isQualifiedLead,
        newLead.status,
        newLead.nextFollowupDate ? new Date(newLead.nextFollowupDate) : null,
        newLead.assignedSalesUser || null,
        newLead.companyName || null,
        newLead.requirement,
        newLead.estValue,
        newLead.score,
        newLead.notes || null,
        newLead.avatarTone,
        newLead.initials,
        newLead.followupStatus || null,
        newLead.callReason || null,
        newLead.yetToCallNotes || null,
        newLead.dateCaptured ? new Date(newLead.dateCaptured) : new Date(),
        newLead.serviceInterest || null,
        newLead.industry || null,
        newLead.companySize || null,
        newLead.pipelineStage || 'New',
        newLead.leadOwner || null,
        newLead.estimatedDealValue || null,
        newLead.probability || 50,
        newLead.expectedCloseDate ? new Date(newLead.expectedCloseDate) : null,
        newLead.lastContactDate ? new Date(newLead.lastContactDate) : null,
        newLead.followupNotes || null,
        newLead.lostReason || null,
        newLead.daysInPipeline || 0,
        newLead.createdAt,
        newLead.updatedAt,
        newLead.jobTitle || null,
      ];
      await this.pool.query(insertQuery, values);
      this.logger.log(`Persisted lead ${nextId} with 21 CRM attributes into PostgreSQL public."LEAD" table!`);
    } catch (dbErr) {
      this.logger.error(`Failed to insert lead ${nextId} into PostgreSQL:`, dbErr);
    }

    this.leadsStore.unshift(newLead);
    return newLead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<LeadEntity> {
    const existing = await this.findOne(id);

    const leadName = updateLeadDto.leadName !== undefined ? updateLeadDto.leadName.trim() : existing.leadName;
    const jobTitle = updateLeadDto.jobTitle !== undefined ? (updateLeadDto.jobTitle?.trim() || null) : (existing.jobTitle || null);
    const leadNumber = updateLeadDto.leadNumber !== undefined
      ? updateLeadDto.leadNumber.trim()
      : (updateLeadDto.phone !== undefined ? updateLeadDto.phone.trim() : existing.leadNumber);
    const leadEmail = updateLeadDto.leadEmail !== undefined
      ? (updateLeadDto.leadEmail?.trim() || null)
      : (updateLeadDto.email !== undefined ? (updateLeadDto.email?.trim() || null) : existing.leadEmail);
    const source = updateLeadDto.leadSource || updateLeadDto.source || existing.source;
    const isQualified = updateLeadDto.isQualifiedLead !== undefined
      ? updateLeadDto.isQualifiedLead
      : existing.isQualifiedLead;
    const stage = updateLeadDto.pipelineStage || updateLeadDto.status || updateLeadDto.stage || existing.stage;
    const followupDate = updateLeadDto.nextFollowupDate !== undefined
      ? updateLeadDto.nextFollowupDate
      : existing.nextFollowupDate;
    const followupStatus = updateLeadDto.followupStatus !== undefined
      ? (updateLeadDto.followupStatus?.trim() || null)
      : existing.followupStatus;
    const callReason = updateLeadDto.callReason !== undefined
      ? (updateLeadDto.callReason?.trim() || null)
      : existing.callReason;
    const yetToCallNotes = updateLeadDto.yetToCallNotes !== undefined
      ? (updateLeadDto.yetToCallNotes?.trim() || null)
      : existing.yetToCallNotes;
    const salesUser = updateLeadDto.leadOwner !== undefined
      ? updateLeadDto.leadOwner.trim()
      : (updateLeadDto.assignedSalesUser !== undefined ? updateLeadDto.assignedSalesUser.trim() : existing.assignedSalesUser);

    const companyName = updateLeadDto.companyName !== undefined ? (updateLeadDto.companyName?.trim() || null) : existing.companyName;
    const serviceInterest = updateLeadDto.serviceInterest !== undefined ? updateLeadDto.serviceInterest.trim() : (updateLeadDto.requirement !== undefined ? updateLeadDto.requirement.trim() : existing.serviceInterest);
    const industry = updateLeadDto.industry !== undefined ? updateLeadDto.industry.trim() : existing.industry;
    const companySize = updateLeadDto.companySize !== undefined ? updateLeadDto.companySize.trim() : existing.companySize;
    const pipelineStage = stage;
    const leadOwner = salesUser;
    const estimatedDealValue = updateLeadDto.estimatedDealValue !== undefined ? this.formatEstValue(updateLeadDto.estimatedDealValue) : (updateLeadDto.estValue !== undefined ? this.formatEstValue(updateLeadDto.estValue) : existing.estimatedDealValue);
    const probability = updateLeadDto.probability !== undefined ? Number(updateLeadDto.probability) : existing.probability;
    const expectedCloseDate = updateLeadDto.expectedCloseDate !== undefined ? updateLeadDto.expectedCloseDate : existing.expectedCloseDate;
    const lastContactDate = updateLeadDto.lastContactDate !== undefined ? updateLeadDto.lastContactDate : existing.lastContactDate;
    const followupNotes = updateLeadDto.followupNotes !== undefined ? (updateLeadDto.followupNotes?.trim() || null) : (updateLeadDto.notes !== undefined ? (updateLeadDto.notes?.trim() || null) : existing.followupNotes);
    const status = updateLeadDto.status !== undefined ? updateLeadDto.status : existing.status;
    const lostReason = updateLeadDto.lostReason !== undefined ? (updateLeadDto.lostReason?.trim() || null) : existing.lostReason;
    const dateCaptured = updateLeadDto.dateCaptured !== undefined ? updateLeadDto.dateCaptured : existing.dateCaptured;
    const daysInPipeline = updateLeadDto.daysInPipeline !== undefined ? Number(updateLeadDto.daysInPipeline) : existing.daysInPipeline;

    const initials = this.computeInitials(leadName);
    const avatarTone = this.assignAvatarTone(source, initials);

    const updatedLead: LeadEntity = {
      ...existing,
      id: existing.id,
      leadId: existing.id,
      dateCaptured,
      leadName,
      jobTitle,
      companyName,
      leadEmail,
      email: leadEmail,
      leadNumber,
      phone: leadNumber,
      leadSource: source,
      source,
      serviceInterest,
      industry,
      companySize,
      pipelineStage,
      stage: pipelineStage,
      leadOwner,
      assignedSalesUser: leadOwner,
      estimatedDealValue,
      estValue: estimatedDealValue,
      probability,
      expectedCloseDate,
      lastContactDate,
      nextFollowupDate: followupDate,
      followupNotes,
      notes: followupNotes,
      status,
      lostReason,
      daysInPipeline,
      isQualifiedLead: isQualified,
      followupStatus,
      callReason,
      yetToCallNotes,
      requirement: serviceInterest || 'Enterprise IT Infrastructure',
      score: existing.score,
      avatarTone,
      initials,
      updatedAt: new Date(),
    };

    try {
      const updateQuery = `
        UPDATE public."LEAD" SET
          "Lead_Name" = $1,
          "Lead_Number" = $2,
          "Lead_Email" = $3,
          "Lead_Source" = $4,
          "Is_Qualified_Lead" = $5,
          "Status" = $6,
          "Next_Followup_Date" = $7,
          "Assigned_Sales_User" = $8,
          "Company_Name" = $9,
          "Requirement" = $10,
          "Est_Value" = $11,
          "Score" = $12,
          "Notes" = $13,
          "Avatar_Tone" = $14,
          "Initials" = $15,
          "Followup_Status" = $16,
          "Call_Reason" = $17,
          "Yet_To_Call_Notes" = $18,
          "Date_Captured" = $19,
          "Service_Interest" = $20,
          "Industry" = $21,
          "Company_Size" = $22,
          "Pipeline_Stage" = $23,
          "Lead_Owner" = $24,
          "Estimated_Deal_Value" = $25,
          "Probability" = $26,
          "Expected_Close_Date" = $27,
          "Last_Contact_Date" = $28,
          "Followup_Notes" = $29,
          "Lost_Reason" = $30,
          "Days_In_Pipeline" = $31,
          "Updated_At" = $32,
          "Job_Title" = $33
        WHERE LOWER("Lead_Id") = LOWER($34)
        RETURNING *;
      `;
      const values = [
        updatedLead.leadName,
        updatedLead.leadNumber,
        updatedLead.leadEmail,
        updatedLead.leadSource,
        updatedLead.isQualifiedLead,
        updatedLead.status,
        updatedLead.nextFollowupDate ? new Date(updatedLead.nextFollowupDate) : null,
        updatedLead.assignedSalesUser || null,
        updatedLead.companyName || null,
        updatedLead.requirement,
        updatedLead.estValue,
        updatedLead.score,
        updatedLead.notes || null,
        updatedLead.avatarTone,
        updatedLead.initials,
        updatedLead.followupStatus || null,
        updatedLead.callReason || null,
        updatedLead.yetToCallNotes || null,
        updatedLead.dateCaptured ? new Date(updatedLead.dateCaptured) : new Date(),
        updatedLead.serviceInterest || null,
        updatedLead.industry || null,
        updatedLead.companySize || null,
        updatedLead.pipelineStage || 'New',
        updatedLead.leadOwner || null,
        updatedLead.estimatedDealValue || null,
        updatedLead.probability || 50,
        updatedLead.expectedCloseDate ? new Date(updatedLead.expectedCloseDate) : null,
        updatedLead.lastContactDate ? new Date(updatedLead.lastContactDate) : null,
        updatedLead.followupNotes || null,
        updatedLead.lostReason || null,
        updatedLead.daysInPipeline || 0,
        updatedLead.updatedAt,
        updatedLead.jobTitle || null,
        id,
      ];
      await this.pool.query(updateQuery, values);
      this.logger.log(`Updated lead ${id} with 20 CRM attributes in PostgreSQL public."LEAD" table.`);
    } catch (dbErr) {
      this.logger.error(`Failed to update lead ${id} in PostgreSQL:`, dbErr);
    }

    const idx = this.leadsStore.findIndex(l => l.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      this.leadsStore[idx] = updatedLead;
    } else {
      this.leadsStore.unshift(updatedLead);
    }

    return updatedLead;
  }

  async delete(id: string): Promise<{ success: boolean; id: string }> {
    try {
      await this.pool.query(
        'DELETE FROM public."LEAD" WHERE LOWER("Lead_Id") = LOWER($1)',
        [id],
      );
      this.logger.log(`Deleted lead ${id} from PostgreSQL public."LEAD" table.`);
    } catch (dbErr) {
      this.logger.error(`Failed to delete lead ${id} in PostgreSQL:`, dbErr);
    }

    const index = this.leadsStore.findIndex(l => l.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      this.leadsStore.splice(index, 1);
    }

    return { success: true, id };
  }

  async convert(id: string): Promise<LeadEntity> {
    return this.update(id, {
      isQualifiedLead: true,
      status: 'Qualified',
    });
  }

  async getKpis(): Promise<LeadKpis> {
    const leads = await this.findAll();
    const total = leads.length;

    if (total === 0) {
      return {
        totalOpenLeads: 0,
        openLeadsGrowth: '0% this week',
        websitePercentage: 0,
        whatsappPercentage: 0,
        phonePercentage: 0,
      };
    }

    const websiteCount = leads.filter(l => l.source === 'Website').length;
    const whatsappCount = leads.filter(l => l.source === 'WhatsApp').length;
    const phoneCount = leads.filter(l => l.source === 'Phone').length;

    return {
      totalOpenLeads: total,
      openLeadsGrowth: '▲ 12% this week',
      websitePercentage: Math.round((websiteCount / total) * 100),
      whatsappPercentage: Math.round((whatsappCount / total) * 100),
      phonePercentage: Math.round((phoneCount / total) * 100),
    };
  }
}
