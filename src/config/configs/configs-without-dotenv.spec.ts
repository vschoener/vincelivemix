const OLD_ENV = process.env;
process.env = {};

import { authConfigDto } from './auth-config';
import { databaseConfigDto } from './database-config';
import { webServerConfigDto } from './web-server.config';

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
        isSuperAdminUserEnabled: false,
        lifetime: 3600,
        privateKey:
          '----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAx8RG2RjLntWQLyamnWWGsqrfTYsmXMkccIj56iUHIpH47VAe\nfJ/D/u9yb9IFypSKM4WLqfUcWS1qNBjvrPMynXP7bLCFSizIL4UNWskFMdOdTAhk\nHcrpl5eSlOEVm370rH4wVM8mJMbt5ttRsYFIH2ORD8wduJBJg+VPNGGcKkZc5EBS\ndP+zB+eHBtS/mdXOm4yh3HH294j0/C78p2KiJBmlSP11TzDHtutQv4Of6zcNGZkj\nzNMB9/EzSy9xAcExBRUtLwSo9HVM9vSH5PBX9ZfqfEMqPQ7GFdL61QcICejttd9o\nZemqcvTYfHR2+5kRF64O/gJ4+b2dceNLryrRIwIDAQABAoIBAGwp5WaVG2NkJU6y\ncdKVb0p8ZK5a4qmopwJz2EWkSOm5+fucvvUhmIEH64GKSWJ37SCadZXPxsquYWvV\n+Kg/gi9o5kDijzkraDT6qNF4OJzTBL9vZ64N+U8AXfjIqudn5VkkdkzlYLTXFWdD\nZ0diRcfhJGFWVt1hGr0Uwz8Mfv8P50EV7b2xh+QKtCgz2XOPIiTPCITd/hq0Tm2C\nCP8mYHdeDvCXF5pQz2eWXhl4Ym025tHQhILpGsQZfs2fQ0uaJQB4vvmfJY+dhnAx\nqhORUz3xQ9lCUy86SHLDsL7S8/t2114V3PiOs9CEQuA8DSi3JND3mM40Rhor9K4e\n9zRo+SECgYEA5Nb09r4szhWkmUvwbxxXYbxJf2LUJthpAbS5Zi6SrS9xKkN9EAy9\n/V9iVyZ10aGn1Osx7HtjvPfCQ40itVSxXM//VYVME6hEale0fWR1xivr4/Rn0sCx\nROTsOTLK0Nj1Yy/AMbJt+yMqvu8jDQEDkwXJw830iJ8K+U1BA2rq0lECgYEA33n4\nMWBFjfADdKVI8TNZHW+KQhxNhJF4AAVdmo+kmCjoWph+NU2VlkmruK1qnIwqt3Gf\nriCpU1HVRT0HR5lBX1wfsafCAtAKB08TpGVfKA2GszzVeSpbVAlJXXz0LMGdM45N\nIeRZGpn1k+GwogV2AV6godyoCNJwzBS8cj52ezMCgYEA2J1xfC9AkkOCb2mmykZ1\noJpuqBqQ38RygZ7k8IidZzpFUNBZjdvB7BliKUTKugjfqXiI5WVXYATW6sKqXCMz\nULvC4t0uyly5hkBHJXr20QO6YylzLdgg9SoNQYeG3HLCtYT51RElclgzmlEbSK/x\nBjawapyGIN0LsjkilW2bokECgYAcDpAegtu4qj2E04uI3M1/aJWPH0aMMkdCmWnb\nEdW0VM53MVYHEyqIp88rbHpKFT73sQg/MFKR52BDRRo43wDaHBLOlyVAfSYFLORm\na2O6/5e9wRF8GNlGf7P6TMnLJLO72U3Nx4F4WYP/gQJQFSdvnJXGPJHMKb+Hn8LZ\nBQaTCQKBgQCOSpjGM882KHjC/Mr3e8BKii1BAR1aEI0lDyAHD90ozi9sA6xAh7tM\nwccmqrtok3rcgaxkEa44lwIg/QfODmOiZ/sQbVj3srgvUEs85or1cX82cwbBXBxK\nJg31gSVi79LcB/+W7BezGtex7Ru6rTja6DJalM0HzD5s3OsLWV2h+Q==\n-----END RSA PRIVATE KEY-----',
        superAdminPassword: 'superpassword',
        superAdminUser: 'superuser',
      });
    });
  });

  describe('database.config', () => {
    it('should load the default config', () => {
      expect(databaseConfigDto).toEqual({
        autoRunMigration: false,
        database: 'vincelivemix',
        host: 'localhost',
        logging: false,
        password: 'postgres',
        port: 5432,
        retriesNumber: 1,
        synchronize: false,
        user: 'postgres',
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
