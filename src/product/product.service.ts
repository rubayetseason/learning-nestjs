import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 499.99 },
    { id: 3, name: 'Tablet', price: 299.99 },
    { id: 4, name: 'Monitor', price: 199.99 },
    { id: 5, name: 'Headphones', price: 49.99 },
  ];

  getAllProducts() {
    return this.products;
  }

  getProductById(id: number) {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  createProduct(data: { name: string; price: number }) {
    const newProduct = {
      id: this.products.length + 1,
      ...data,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, data: { name?: string; price?: number }) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1)
      throw new NotFoundException(`Product with ID ${id} not found`);
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  deleteProduct(id: number) {
    const deletableProduct = this.products.find((product) => product.id === id);
    if (!deletableProduct)
      throw new NotFoundException(`Product with ID ${id} not found`);
    this.products = this.products.filter((product) => product.id !== id);
    return deletableProduct;
  }
}
