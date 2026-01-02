import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }
  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }
  @Post()
  createProduct(@Body() body: { name: string; price: number }) {
    const res = this.productService.createProduct({
      name: body.name,
      price: body.price,
    });
    return res;
  }
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number },
  ) {
    return this.productService.updateProduct(Number(id), {
      name: body.name,
      price: body.price,
    });
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
