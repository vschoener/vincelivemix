import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT, 0) || 5432,
  username: process.env.TYPEORM_USERNAME || 'john',
  password: process.env.TYPEORM_PASSWORD || 'pwd0123456789',
  database: process.env.TYPEORM_DATABASE || 'vincelivemix',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  migrationsRun: process.env.TYPEORM_AUTO_RUN_MIGRATION === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  logger: 'file',
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

// Only for TypeORM CLI
export = typeOrmConfig;
