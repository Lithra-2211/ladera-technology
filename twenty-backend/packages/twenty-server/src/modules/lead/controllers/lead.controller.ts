import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiPath } from 'twenty-shared/types';

import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

import { CreateLeadDto } from '../dtos/create-lead.dto';
import { UpdateLeadDto } from '../dtos/update-lead.dto';
import { LeadEntity, LeadKpis, LeadService } from '../services/lead.service';

@Controller([`${ApiPath.ClientConfig}/leads`, `${ApiPath.Rest}/leads`])
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async findAll(): Promise<LeadEntity[]> {
    return this.leadService.findAll();
  }

  @Get('kpis')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getKpis(): Promise<LeadKpis> {
    return this.leadService.getKpis();
  }

  @Get(':id')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async findOne(@Param('id') id: string): Promise<LeadEntity> {
    return this.leadService.findOne(id);
  }

  @Post()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createLeadDto: CreateLeadDto): Promise<LeadEntity> {
    return this.leadService.create(createLeadDto);
  }

  @Put(':id')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ): Promise<LeadEntity> {
    return this.leadService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async delete(@Param('id') id: string): Promise<{ success: boolean; id: string }> {
    return this.leadService.delete(id);
  }

  @Post(':id/convert')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async convert(@Param('id') id: string): Promise<LeadEntity> {
    return this.leadService.convert(id);
  }
}
