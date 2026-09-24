import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@Entity({ name: 'CUSTOMER_LOCATION', schema: 'core' })
@ObjectType('CustomerLocation')
export class CustomerLocationEntity {
  @Field(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid', { name: 'Location_Id' })
  locationId: string;

  @Field(() => UUIDScalarType)
  @Column({ name: 'Cid', type: 'uuid' })
  cid: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Contact_Person_Name', type: 'varchar', nullable: true })
  contactPersonName?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Mobile_Number', type: 'varchar', nullable: true })
  mobileNumber?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Email', type: 'varchar', nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Country', type: 'varchar', nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'State', type: 'varchar', nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'City', type: 'varchar', nullable: true })
  city?: string;

  @Field(() => String)
  @Column({ name: 'Location_Name', type: 'varchar' })
  locationName: string;

  @Field(() => String)
  @Column({ name: 'Address_Line', type: 'text' })
  addressLine: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'Pincode', type: 'varchar', nullable: true })
  pincode?: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cid' })
  customer: Relation<CustomerEntity>;
}
