import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.database,
      synchronize: config.synchronize,
      migrationsRun: config.autoRunMigration,
      logging: config.logging,
      logger: 'debug',
      retryAttempts: config.retriesNumber,
      migrations: ['dist/migrations/**/*.{ts,js}'],
      autoLoadEntities: true,
      cli: {
        migrationsDir: 'dist/migrations',
      },
    };
  }
}
