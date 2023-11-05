import {registerAs} from '@nestjs/config';
import {config as dotenvConfig} from 'dotenv';
import {DataSource, DataSourceOptions} from 'typeorm';

dotenvConfig({path: '.env'});

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}` || 'localhost',
  port: `${process.env.DB_PORT}` || 5432,
  username: `${process.env.DB_USERNAME}` || 'postgres',
  password: `${process.env.DB_PASSWORD}` || '',
  database: `${process.env.DB_NAME}` || 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

console.log(config);

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
