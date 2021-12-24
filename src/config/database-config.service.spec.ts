import { DatabaseConfigService } from './database-config.service';
import { DatabaseConfigDto } from './dto/database-config.dto';

describe('DatabaseConfigService', () => {
  describe('getTypeORMConfig', () => {
    it('should return a formatted TypeORM config', () => {
      const databaseConfigDto = new DatabaseConfigDto({
        retriesNumber: 100,
        autoRunMigration: false,
        logging: true,
        synchronize: true,
        type: 'postgres',
        url: 'postgres_url'
      });

      expect(DatabaseConfigService.getTypeORMConfig(databaseConfigDto)).toEqual(
        {
          autoLoadEntities: true,
          cli: {
            migrationsDir: 'dist/migrations',
          },
          keepConnectionAlive: true,
          logger: 'debug',
          logging: true,
          migrations: ['dist/migrations/**/*.{ts,js}'],
          migrationsRun: false,
          name: 'default',
          retryAttempts: 100,
          synchronize: true,
          type: 'postgres',
          url: 'postgres_url'
        },
      );
    });
  });
});
