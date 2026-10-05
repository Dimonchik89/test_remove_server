import { DataSourceOptions, DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (): DataSourceOptions => ({
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: +process.env.POSTGRES_PORT!,
  host: process.env.POSTGRES_HOST,
  type: 'postgres',
  synchronize: true, // только в режиме разработки, в режиме продашина нужно переключить на false
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
});
