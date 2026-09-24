import { Resolver, Mutation, Args, InputType, Field, Query, ObjectType } from '@nestjs/graphql';
import { CustomerService } from '../services/customer.service';
import { CustomerEntity } from '../entities/customer.entity';

import { CoreResolver } from 'src/engine/api/graphql/graphql-config/decorators/core-resolver.decorator';

@ObjectType()
export class CountryInfo {
  @Field()
  code: string;

  @Field()
  name: string;
}

@ObjectType()
export class StateInfo {
  @Field()
  code: string;

  @Field()
  name: string;
}

@InputType()
export class CreateLocationInput {
  @Field()
  locationName: string;

  @Field()
  addressLine: string;

  @Field({ nullable: true })
  pincode?: string;

  @Field({ nullable: true })
  contactPersonName?: string;

  @Field({ nullable: true })
  mobileNumber?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;
}

@InputType()
export class CreateCustomerInput {
  @Field()
  customerCode: string;

  @Field()
  mobileNumber: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  customerType: string;

  @Field({ nullable: true })
  locationName?: string;

  @Field({ nullable: true })
  addressLine?: string;

  @Field({ nullable: true })
  pincode?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  country?: string;

  @Field(() => [CreateLocationInput], { nullable: true })
  locations?: CreateLocationInput[];
}

@CoreResolver(() => CustomerEntity)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [CountryInfo])
  getCountries(): CountryInfo[] {
    return this.customerService.getCountries();
  }

  @Query(() => [StateInfo])
  getStates(@Args('countryCode') countryCode: string): StateInfo[] {
    return this.customerService.getStates(countryCode);
  }

  @Mutation(() => CustomerEntity)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
  ): Promise<CustomerEntity> {
    return this.customerService.createCustomer(input);
  }

  @Mutation(() => CustomerEntity)
  async addDealerLocations(
    @Args('cid') cid: string,
    @Args('locations', { type: () => [CreateLocationInput] }) locations: CreateLocationInput[],
  ): Promise<CustomerEntity> {
    return this.customerService.addDealerLocations(cid, locations);
  }

  @Mutation(() => Boolean)
  async updateDealerLocation(
    @Args('locationId') locationId: string,
    @Args('input') input: CreateLocationInput,
  ): Promise<boolean> {
    return this.customerService.updateDealerLocation(locationId, input);
  }

  @Mutation(() => Boolean)
  async deleteDealerLocation(
    @Args('locationId') locationId: string,
  ): Promise<boolean> {
    return this.customerService.deleteDealerLocation(locationId);
  }

  @Query(() => [CustomerEntity])
  async getDealers(): Promise<CustomerEntity[]> {
    return this.customerService.getDealers();
  }

  @Query(() => [CustomerEntity])
  async getCustomers(): Promise<CustomerEntity[]> {
    return this.customerService.getCustomers();
  }
}
