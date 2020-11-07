import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface ICreateOrderProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: ICreateOrderProduct[];
}

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Costumer does not exist');
    }

    const actualProducts = await this.productsRepository.findAllById(products);

    const OrderProducts: IProduct[] = products.map(product => {
      const correspondingProduct = actualProducts.find(
        item => item.id === product.id,
      );

      if (!correspondingProduct) {
        throw new AppError('Problem finding product on database');
      }

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: correspondingProduct.price,
      };
    });

    const newOrder = await this.ordersRepository.create({
      customer,
      products: OrderProducts,
    });

    return newOrder;
  }
}

export default CreateOrderService;
