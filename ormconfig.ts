import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const typeOrmConfig = new DataSource({
  type: 'mssql',
  // ssl: process.env.DB_SSL === 'true',
  url: process.env.MASTER_DB_URL,
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  extra: {
    trustServerCertificate: true,
  },
  requestTimeout: 60000,
  connectionTimeout: 60000,
});

export default typeOrmConfig;
