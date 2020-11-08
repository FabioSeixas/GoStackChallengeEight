import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
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

    const readyProducts = products.map(product => {
      const correspondingProduct = actualProducts.find(
        item => item.id === product.id,
      );

      if (!correspondingProduct) {
        throw new AppError(`Invalid product id: "${product.id}"`);
      }

      const updatedQuantity = correspondingProduct.quantity - product.quantity;

      if (updatedQuantity < 0) {
        throw new AppError(
          `Insuficient quantities for product id "${product.id}"`,
        );
      }

      return {
        price: correspondingProduct.price,
        quantity: product.quantity,
        product_id: product.id,
      };
    });

    actualProducts.forEach(actualProduct => {
      const orderedProduct = products.find(
        item => item.id === actualProduct.id,
      );

      if (!orderedProduct) {
        throw new AppError('invalid product id');
      }

      const updatedQuantity = actualProduct.quantity - orderedProduct?.quantity;

      Object.assign(actualProduct, { quantity: updatedQuantity });
    });

    await this.productsRepository.updateQuantity(actualProducts);

    const newOrder = await this.ordersRepository.create({
      customer,
      products: readyProducts,
    });

    return newOrder;
  }
}

export default CreateOrderService;
