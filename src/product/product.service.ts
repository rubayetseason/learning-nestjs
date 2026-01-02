import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductType } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  getProductById(id: number): IProductType {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  createProduct(data: CreateProductDto): IProductType {
    const nextId =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id)) + 1
        : 1;

    const newProduct: IProductType = {
      id: nextId,
      name: data.name,
      price: data.price,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, data: UpdateProductDto): IProductType {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct: IProductType = {
      ...this.products[index],
      ...(data.name !== undefined && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  deleteProduct(id: number): IProductType {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }
}
