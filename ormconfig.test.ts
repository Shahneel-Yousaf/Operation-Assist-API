import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: '.env.test' });

const typeOrmConfig = new DataSource({
  type: 'mssql',
  url: process.env.MASTER_DB_URL,
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  extra: {
    trustServerCertificate: true,
  },
});

export default typeOrmConfig;
