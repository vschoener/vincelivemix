const OLD_ENV = process.env;
process.env = {};

import { databaseConfigDto } from './database-config';
import { webServerConfigDto } from './web-server.config';

describe('Configs without dotenv', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('database.config', () => {
    it('should load the default config', () => {
      expect(databaseConfigDto).toEqual({
        autoRunMigration: false,
        logging: false,
        retriesNumber: 1,
        synchronize: false,
        type: 'postgres',
        url: undefined
      });
    });
  });

  describe('web-server.config', () => {
    it('should load the default config', () => {
      expect(webServerConfigDto).toEqual({
        port: 8080,
      });
    });
  });
});
