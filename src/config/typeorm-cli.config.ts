import * as dotenv from 'dotenv';
import { ConfigDatabaseService } from '../core/config/config-database.service';
import { WinstonModule } from 'nest-winston';
import { loggerSettings } from '../core/logger/logger.settings';
import { Logger } from 'winston';

/**
 * Handle TypeORM CLI Case
 */
if (!module.parent) {
  dotenv.config();
}

const winstonLoaded = WinstonModule.forRoot(loggerSettings);

// @ts-ignore
const logger = winstonLoaded.exports.find<Logger>(({ provide }) => provide === 'winston');
console.log(logger);
const configDatabaseDto = ConfigDatabaseService.mapEnvToDto();
ConfigDatabaseService.validate(configDatabaseDto, logger);

const config = ConfigDatabaseService.getTypeOrmConfig(configDatabaseDto);

export default config;