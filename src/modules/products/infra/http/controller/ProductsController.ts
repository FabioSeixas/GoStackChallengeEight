import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductQuantityService from '@modules/products/services/UpdateProductQuantityService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const newProduct = await createProduct.execute({
      name,
      price,
      quantity,
    });

    return response.json(newProduct);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const products = request.body;

    const updateQuantity = container.resolve(UpdateProductQuantityService);

    const updatedProducts = await updateQuantity.execute({ products });

    return response.json(updatedProducts);
  }
}
