import * as dotenv from 'dotenv';
import fs from 'fs';

/**
 * As some env exist for testcontainers and e2e test, this would have the effect to keep this
 * test isolated. I think is not right playing with process.env but this is a
 * isolated case
 * @see https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
 */
const OLD_ENV = process.env;
process.env = dotenv.parse(
  fs.readFileSync(`${__dirname}/__mock/dotenv_test.env`),
);

import { authConfigDto } from './auth-config';
import { databaseConfigDto } from './database-config';
import { webServerConfigDto } from './web-server.config';

/**
 * AS a note, it was cleaner to duplicate the test and separate them to either or
 * not load .env file, otherwise I would have to deal with infinite import es6/7 import
 * eslint ignore, ts ignore ans so on and the code would be messy to follow
 */

describe('Configs without dotenv', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('auth.config', () => {
    it('should load the default config', () => {
      expect(authConfigDto).toEqual({
        isSuperAdminUserEnabled: true,
        lifetime: 100,
        privateKey: 'private_key',
        superAdminPassword: 'Passw0rd',
        superAdminUser: 'admin',
      });
    });
  });

  describe('database.config', () => {
    it('should load the default config', () => {
      expect(databaseConfigDto).toEqual({
        autoRunMigration: true,
        database: 'db_test',
        host: 'postgres',
        logging: true,
        password: 'postgres',
        port: 9999,
        retriesNumber: 10,
        synchronize: true,
        user: 'postgres',
      });
    });
  });

  describe('web-server.config', () => {
    it('should load the default config', () => {
      expect(webServerConfigDto).toEqual({
        port: 8888,
      });
    });
  });
});