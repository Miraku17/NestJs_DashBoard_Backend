// customer.service.ts
import { Injectable } from '@nestjs/common';
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

  create(dto: CreateCustomerDto) {
    const customer = this.customerRepo.create(dto);
    return this.customerRepo.save(customer);
  }

  findAll() {
    return this.customerRepo.find();
  }

  findOne(id: string) {
    return this.customerRepo.findOneBy({ id });
  }

  async remove(id: string) {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }
    return { message: 'Customer deleted successfully' };
  }
  
}
