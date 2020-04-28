import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from 'winston';

import { DatabaseConfigDto } from './dto/database-config.dto';
import { ConfigLoaderService } from './config-loader.service';
import { ConfigNotInitializedException } from './exceptions/config-not-initialized.exception';

@Injectable()
export class DatabaseConfigService {
  constructor(
    private readonly configLoader: ConfigLoaderService<DatabaseConfigDto>,
    @Inject('winston') logger: Logger,
  ) {}

  /**
   * This method was required to be used first but it brings side effect and
   * too many code to handle bringing not values.
   */
  public async load() {
    const configuration = new DatabaseConfigDto({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      autoRunMigration: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    });

    await this.configLoader.load(configuration);

    return this;
  }

  public get(): DatabaseConfigDto {
    if (!this.configLoader.isLoaded()) {
      throw new ConfigNotInitializedException(
        'Configuration not initialized, did you forget to use "load"?',
      );
    }

    return this.configLoader.get();
  }

  /**
   * We care having this used by CLI or App to keep one unique point of true
   *
   * @param config
   */
  public static getTypeORMConfig(
    config: DatabaseConfigDto,
  ): TypeOrmModuleOptions {
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
    };
  }
}
