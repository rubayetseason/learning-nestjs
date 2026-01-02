import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductType } from './interfaces/product.interface';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  private products: IProductType[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 499.99 },
    { id: 3, name: 'Tablet', price: 299.99 },
    { id: 4, name: 'Monitor', price: 199.99 },
    { id: 5, name: 'Headphones', price: 49.99 },
  ];

  getAllProducts(): IProductType[] {
    return this.products;
  }

  getProductById(id: number): IProductType | undefined {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  createProduct(createProductDto: ProductDto): IProductType {
    const newProduct: IProductType = {
      id: this.products.length + 1,
      ...createProductDto,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(
    id: number,
    data: { name?: string; price?: number },
  ): IProductType {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1)
      throw new NotFoundException(`Product with ID ${id} not found`);
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  deleteProduct(id: number): IProductType {
    const deletableProduct = this.products.find((product) => product.id === id);
    if (!deletableProduct)
      throw new NotFoundException(`Product with ID ${id} not found`);
    this.products = this.products.filter((product) => product.id !== id);
    return deletableProduct;
  }
}
