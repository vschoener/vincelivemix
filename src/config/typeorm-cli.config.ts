import * as dotenv from 'dotenv';
import { validateSync } from 'class-validator';

import { DatabaseConfigDto } from './dto/database-config.dto';
import { DatabaseConfigService } from './database-config.service';
import { databaseConfigDto } from './configs/database-config';
import { DataSource } from 'typeorm';

/**
 * Handle TypeORM CLI Case
 */
if (!module.parent) {
  dotenv.config();
}

const config = new DatabaseConfigDto(databaseConfigDto);
const dataSourceConfig = DatabaseConfigService.getDataSourceConfig(config)

validateSync(config);

const dataSource = new DataSource(dataSourceConfig)
export default dataSource
