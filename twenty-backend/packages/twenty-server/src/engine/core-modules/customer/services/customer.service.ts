import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerLocationEntity } from '../entities/customer-location.entity';

export interface CreateLocationDto {
  locationName: string;
  addressLine: string;
  pincode?: string;
  contactPersonName?: string;
  mobileNumber?: string;
  email?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface CreateCustomerDto {
  customerCode: string;
  mobileNumber: string;
  email?: string | null;
  customerType: string;
  locationName?: string;
  addressLine?: string;
  pincode?: string;
  city?: string;
  state?: string;
  country?: string;
  locations?: CreateLocationDto[];
}

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' }
];

const INDIA_STATES = [
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TG', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UT', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'DH', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'PY', name: 'Puducherry' }
];

const US_STATES = [
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
  { code: 'TX', name: 'Texas' }
];

@Injectable()
export class CustomerService {
  constructor(private readonly dataSource: DataSource) {}

  getCountries() {
    return COUNTRIES;
  }

  getStates(countryCode: string) {
    if (countryCode === 'IN') return INDIA_STATES;
    if (countryCode === 'US') return US_STATES;
    return [];
  }

  async createCustomer(data: CreateCustomerDto): Promise<CustomerEntity> {
    if (!data.customerCode || !data.mobileNumber) {
      throw new BadRequestException('Customer Name and Mobile Number are required.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Insert Customer
      const customer = new CustomerEntity();
      customer.customerCode = data.customerCode;
      customer.mobileNumber = data.mobileNumber;
      customer.email = data.email || null;
      customer.customerType = data.customerType;
      
      const savedCustomer = await queryRunner.manager.save(customer);

      const savedLocations: CustomerLocationEntity[] = [];

      // Handle new locations array
      if (data.locations && data.locations.length > 0) {
        for (const locData of data.locations) {
          if (!locData.contactPersonName || !locData.mobileNumber) {
             throw new BadRequestException('Contact Person and Mobile Number are required for all addresses.');
          }
          const location = new CustomerLocationEntity();
          location.cid = savedCustomer.cid;
          location.locationName = locData.locationName;
          location.addressLine = locData.addressLine;
          location.pincode = locData.pincode;
          location.city = locData.city;
          location.state = locData.state;
          location.country = locData.country;
          location.contactPersonName = locData.contactPersonName;
          location.mobileNumber = locData.mobileNumber;
          location.email = locData.email;
          const savedLoc = await queryRunner.manager.save(location);
          savedLocations.push(savedLoc);
        }
      }

      await queryRunner.commitTransaction();

      savedCustomer.locations = savedLocations;
      return savedCustomer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addDealerLocations(cid: string, locations: CreateLocationDto[]): Promise<CustomerEntity> {
    const customer = await this.dataSource.manager.findOne(CustomerEntity, { where: { cid }, relations: ['locations'] });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const savedLocations: CustomerLocationEntity[] = [];
      for (const locData of locations) {
        const location = new CustomerLocationEntity();
        location.cid = customer.cid;
        location.locationName = locData.locationName;
        location.addressLine = locData.addressLine;
        location.pincode = locData.pincode;
        location.city = locData.city;
        location.state = locData.state;
        location.country = locData.country;
        location.contactPersonName = locData.contactPersonName;
        location.mobileNumber = locData.mobileNumber;
        location.email = locData.email;

        const savedLoc = await queryRunner.manager.save(location);
        savedLocations.push(savedLoc);
      }
      
      await queryRunner.commitTransaction();
      
      customer.locations = [...(customer.locations || []), ...savedLocations];
      return customer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateDealerLocation(locationId: string, data: Partial<CreateLocationDto>): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const location = await queryRunner.manager.findOne(CustomerLocationEntity, { where: { locationId } });
      if (!location) {
        throw new BadRequestException('Location not found');
      }
      
      if (data.locationName !== undefined) location.locationName = data.locationName;
      if (data.addressLine !== undefined) location.addressLine = data.addressLine;
      if (data.pincode !== undefined) location.pincode = data.pincode;
      if (data.city !== undefined) location.city = data.city;
      if (data.state !== undefined) location.state = data.state;
      if (data.country !== undefined) location.country = data.country;
      if (data.contactPersonName !== undefined) location.contactPersonName = data.contactPersonName;
      if (data.mobileNumber !== undefined) location.mobileNumber = data.mobileNumber;
      if (data.email !== undefined) location.email = data.email;
      
      await queryRunner.manager.save(location);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteDealerLocation(locationId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const location = await queryRunner.manager.findOne(CustomerLocationEntity, { where: { locationId } });
      if (!location) {
        throw new BadRequestException('Location not found');
      }
      
      await queryRunner.manager.remove(location);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getDealers(): Promise<CustomerEntity[]> {
    return this.dataSource.manager.find(CustomerEntity, {
      where: { customerType: 'Dealer' },
      relations: ['locations'],
    });
  }

  async getCustomers(): Promise<CustomerEntity[]> {
    return this.dataSource.manager.find(CustomerEntity, {
      relations: ['locations'],
    });
  }
}
