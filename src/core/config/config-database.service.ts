import { ConfigDatabaseDto } from './dto/config-database.dto';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigInterface } from './interfaces/config.interface';
import { ConfigValidationException } from './exceptions/config-validation.exception';
import { ConfigNotInitializedException } from './exceptions/config-not-initialized.exception';
import { validateSync } from 'class-validator';
import { Logger } from 'winston';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigDatabaseService implements ConfigInterface {
  private readonly logger: Logger;
  private configuration: ConfigDatabaseDto;

  constructor(@Inject('winston') logger: Logger) {
    this.logger = logger.child({ context: ConfigDatabaseService.name });
  }

  public async load() {
    this.configuration = ConfigDatabaseService.mapEnvToDto();
    ConfigDatabaseService.validate(this.configuration, this.logger);

    return this;
  }

  public get() {
    if (!this.configuration) {
      throw new ConfigNotInitializedException(
        'Configuration not initialized, did you forget to use "load"?',
      );
    }

    return this.configuration;
  }

  public getTypeORMConfig(): TypeOrmModuleOptions {
    const config = this.get();

    return ConfigDatabaseService.getTypeOrmConfig(config);
  }

  /**
   * Static method below helps for TYPE ORM CLI...
   */

  static validate(configuration: ConfigDatabaseDto, logger: Logger) {
    const validationError = validateSync(configuration);

    if (!validationError.length) {
      logger.error('Database configuration is not valid', { validationError });
      throw new ConfigValidationException(
        'Database configuration is not valid',
      );
    }
  }

  static mapEnvToDto(): ConfigDatabaseDto {
    return new ConfigDatabaseDto({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      autoRunMigration: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    });
  }

  static getTypeOrmConfig(config: ConfigDatabaseDto): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.database,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: config.synchronize,
      migrationsRun: config.autoRunMigration,
      logging: config.logging,
      logger: 'debug',
      migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    }
  }
}
