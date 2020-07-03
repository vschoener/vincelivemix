import { DatabaseConfigDto } from '../dto/database-config.dto';

export const databaseConfigDto: DatabaseConfigDto = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'vincelivemix',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  autoRunMigration: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  retriesNumber: Number(process.env.TYPEORM_RETRIES_NUMBER) || 1,
};
