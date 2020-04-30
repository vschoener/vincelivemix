import * as dotenv from 'dotenv';
import { validateSync } from 'class-validator';

import { DatabaseConfigDto } from './dto/database-config.dto';
import { DatabaseConfigService } from './database-config.service';

/**
 * Handle TypeORM CLI Case
 */
if (!module.parent) {
  dotenv.config();
}

// Duplicated load from config-database.service but code stay clean and easy to use
const config = new DatabaseConfigDto({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  autoRunMigration: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
});

validateSync(config);

export = DatabaseConfigService.getTypeORMConfig(config);
