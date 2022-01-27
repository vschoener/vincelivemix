import { DatabaseConfigDto } from '../dto/database-config.dto';

export const databaseConfigDto: DatabaseConfigDto = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  autoRunMigration: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  retriesNumber: Number(process.env.TYPEORM_RETRIES_NUMBER) || 1,
  ssl: process.env.DATABASE_SSL_CONNECTION === 'true',
};
