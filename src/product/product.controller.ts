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
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  CreateProductDto,
  createProductSchema,
} from './dto/create-product.dto';
import {
  UpdateProductDto,
  updateProductSchema,
} from './dto/update-product.dto';
import { CustomUppercasePipe } from 'src/pipes/custom-pipe-uppercase.pipe';

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

  @Post('uppercase')
  getUppercase(@Body('text', new CustomUppercasePipe()) text: string) {
    return { uppercaseText: text };
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createProductSchema))
    data: CreateProductDto,
  ) {
    return this.productService.createProduct(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema))
    data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
