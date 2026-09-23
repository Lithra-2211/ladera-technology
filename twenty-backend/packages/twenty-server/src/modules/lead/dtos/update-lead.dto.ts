import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  dateCaptured?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Lead name must be at least 2 characters long' })
  leadName?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  leadEmail?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  leadNumber?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  leadSource?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  @IsString()
  pipelineStage?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  leadOwner?: string;

  @IsOptional()
  @IsString()
  assignedSalesUser?: string;

  @IsOptional()
  @IsString()
  estimatedDealValue?: string;

  @IsOptional()
  @IsString()
  estValue?: string;

  @IsOptional()
  probability?: number | string;

  @IsOptional()
  @IsString()
  expectedCloseDate?: string;

  @IsOptional()
  @IsString()
  lastContactDate?: string;

  @IsOptional()
  @IsString()
  nextFollowupDate?: string;

  @IsOptional()
  @IsString()
  followupNotes?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  lostReason?: string;

  @IsOptional()
  daysInPipeline?: number;

  @IsOptional()
  @IsBoolean()
  isQualifiedLead?: boolean;

  @IsOptional()
  @IsString()
  requirement?: string;

  @IsOptional()
  @IsString()
  score?: string;

  @IsOptional()
  @IsString()
  followupStatus?: string;

  @IsOptional()
  @IsString()
  callReason?: string;

  @IsOptional()
  @IsString()
  yetToCallNotes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  newTimelineItem?: any;
}