import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  // Create a new customer
  async create(dto: CreateCustomerDto) {
    const customer = this.customerRepo.create(dto);
    const savedCustomer = await this.customerRepo.save(customer);
    return {
      success: true,
      message: 'Customer created successfully',
      data: savedCustomer,
    };
  }

  // Get all customers
  async findAll() {
    const customers = await this.customerRepo.find();
    const total = await this.customerRepo.count();
    return {
      success: true,
      message: 'Customers retrieved successfully',
      total,
      data: customers,
    };
  }

  // Get a single customer by ID
  async findOne(id: string) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return {
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    };
  }

  // Delete a customer by ID
  async remove(id: string) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.customerRepo.remove(customer);
    return {
      success: true,
      message: 'Customer deleted successfully',
      data: null,
    };
  }
}
