import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerLocationEntity } from './entities/customer-location.entity';
import { CustomerService } from './services/customer.service';
import { CustomerResolver } from './resolvers/customer.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerLocationEntity])],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
