import Customer from '@modules/customers/infra/typeorm/entities/Customer';
// import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

// Troquei IProduct para Product
export default interface ICreateOrderDTO {
  customer: Customer;
  products: IProduct[];
}
