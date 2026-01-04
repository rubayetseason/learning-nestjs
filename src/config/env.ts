import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: Number(process.env.PORT ?? 5000),
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
};
