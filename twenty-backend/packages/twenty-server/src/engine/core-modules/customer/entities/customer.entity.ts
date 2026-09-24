import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  type Relation
} from 'typeorm';
import { CustomerLocationEntity } from './customer-location.entity';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@Entity({ name: 'CUSTOMER', schema: 'core' })
@ObjectType('Customer')
export class CustomerEntity {
  @Field(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid', { name: 'Cid' })
  cid: string;

  @Field(() => String)
  @Column({ name: 'Customer_Code', type: 'varchar' })
  customerCode: string;

  @Field(() => String)
  @Column({ name: 'Mobile_Number', type: 'varchar' })
  mobileNumber: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Email', type: 'varchar', nullable: true })
  email: string | null;

  @Field(() => String)
  @Column({ name: 'Customer_Type', type: 'varchar' })
  customerType: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ name: 'Deleted_At', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Field(() => [CustomerLocationEntity])
  @OneToMany(() => CustomerLocationEntity, (location) => location.customer)
  locations: Relation<CustomerLocationEntity[]>;
}
