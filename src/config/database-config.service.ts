import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { DatabaseConfigDto } from './dto/database-config.dto';

@Injectable()
export class DatabaseConfigService {
  /**
   * We care having this used by CLI or App to keep one unique point of true
   *
   * @param config
   */
  public static getTypeORMConfig(
    config: DatabaseConfigDto,
  ): TypeOrmModuleOptions & Partial<PostgresConnectionOptions> {
    return {
      keepConnectionAlive: true,
      name: 'default',
      type: 'postgres',
      url: config.url,
      synchronize: config.synchronize,
      migrationsRun: config.autoRunMigration,
      logging: config.logging,
      logger: 'debug',
      retryAttempts: config.retriesNumber,
      migrations: ['dist/migrations/**/*.{ts,js}'],
      autoLoadEntities: true,
      ssl: config.ssl,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }

  /**
   * We care having this used by CLI or App to keep one unique point of true
   *
   * @param config
   */
  public static getDataSourceConfig(
    config: DatabaseConfigDto,
  ): PostgresConnectionOptions {
    return {
      name: 'default',
      type: 'postgres',
      url: config.url,
      synchronize: config.synchronize,
      migrationsRun: config.autoRunMigration,
      logging: config.logging,
      logger: 'debug',
      migrations: ['dist/migrations/**/*.{ts,js}'],
      ssl: config.ssl,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }
}
