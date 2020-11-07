import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const newProduct = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(newProduct);

    return newProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsId = products.map(item => item.id);

    const productsFounded = await this.ormRepository.find({
      where: { id: In(productsId) },
    });

    return productsFounded;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsId = products.map(item => item.id);

    const productsFounded = await this.ormRepository.find({
      where: { id: In(productsId) },
    });

    productsFounded.forEach(itemToUpdate => {
      const correspondingProduct = products.find(
        item => item.id === itemToUpdate.id,
      );
      Object.assign(itemToUpdate, { quantity: correspondingProduct?.quantity });
    });

    return productsFounded;
  }
}

export default ProductsRepository;
