import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: Number(process.env.PORT ?? 5000),
  database_url:
    process.env.DATABASE_URL ?? 'mongodb://localhost:27017/learning_nest',
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
};
