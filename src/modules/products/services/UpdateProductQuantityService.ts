import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  products: IProduct[];
}

@injectable()
class UpdateProductQuantityService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ products }: IRequest): Promise<Product[]> {
    const updatedProducts = await this.productsRepository.updateQuantity(
      products,
    );

    return updatedProducts;
  }
}

export default UpdateProductQuantityService;
