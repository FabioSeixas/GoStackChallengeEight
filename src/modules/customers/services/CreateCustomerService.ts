import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const existingEmail = await this.customersRepository.findByEmail(email);

    if (existingEmail) {
      throw new AppError('Email is already been used');
    }

    const newCustomer = await this.customersRepository.create({ email, name });

    return newCustomer;
  }
}

export default CreateCustomerService;
