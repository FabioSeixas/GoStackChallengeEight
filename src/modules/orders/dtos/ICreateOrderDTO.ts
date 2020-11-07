import Customer from '@modules/customers/infra/typeorm/entities/Customer';

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
