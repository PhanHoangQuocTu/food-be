import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv'

config()
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'pgadmin123@',
    database: process.env.DB_NAME || 'food-be',
    synchronize: false,
    logging: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    subscribers: ['dist/db/subscribers/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource
