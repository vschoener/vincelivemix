import * as dotenv from 'dotenv';
import { validateSync } from 'class-validator';

import { DatabaseConfigDto } from './dto/database-config.dto';
import { DatabaseConfigService } from './database-config.service';
import { databaseConfigDto } from './configs/database-config';

/**
 * Handle TypeORM CLI Case
 */
if (!module.parent) {
  dotenv.config();
}

const config = new DatabaseConfigDto(databaseConfigDto);

validateSync(config);

console.log(config)

export = DatabaseConfigService.getTypeORMConfig(config);
