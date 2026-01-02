import { createProductSchema } from './create-product.dto';
import { z } from 'zod';

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
