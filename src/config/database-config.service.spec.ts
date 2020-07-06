import { DatabaseConfigService } from './database-config.service';
import { DatabaseConfigDto } from './dto/database-config.dto';

describe('DatabaseConfigService', () => {
  describe('getTypeORMConfig', () => {
    it('should return a formatted TypeORM config', () => {
      const databaseConfigDto = new DatabaseConfigDto({
        host: 'localhost',
        retriesNumber: 100,
        autoRunMigration: false,
        logging: true,
        database: 'testing',
        password: 'crypted',
        port: 1337,
        synchronize: true,
        user: 'root',
      });

      expect(DatabaseConfigService.getTypeORMConfig(databaseConfigDto)).toEqual(
        {
          autoLoadEntities: true,
          cli: {
            migrationsDir: 'dist/migrations',
          },
          database: 'testing',
          host: 'localhost',
          keepConnectionAlive: true,
          logger: 'debug',
          logging: true,
          migrations: ['dist/migrations/**/*.{ts,js}'],
          migrationsRun: false,
          name: 'default',
          password: 'crypted',
          port: 1337,
          retryAttempts: 100,
          synchronize: true,
          type: 'postgres',
          username: 'root',
        },
      );
    });
  });
});
