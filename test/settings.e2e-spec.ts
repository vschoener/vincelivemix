import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { DateManagerService } from '../src/core/date/date-manager.service';
import { SettingsService } from '../src/settings/settings.service';
import { Settings } from '../src/settings/entity/settings.entity';

describe('SettingsController (e2e)', () => {
  let app: INestApplication;
  let dateManagerService: DateManagerService;
  let settingsService: SettingsService;
  let settingsRepository: Repository<Settings>;
  const date = new Date();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dateManagerService = app.get(DateManagerService);
    settingsService = app.get(SettingsService);
    settingsRepository = app.get(getRepositoryToken(Settings));
    jest.spyOn(dateManagerService, 'getNewDate').mockReturnValue(date);
  });

  afterEach(async () => {
    await settingsRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/settings', () => {
    describe('GET /api/settings/:name', () => {
      it('should return 404 if no settings is not found', () => {
        return request(app.getHttpServer())
          .get('/api/settings/not-exists')
          .expect(404);
      });

      it('should return 200 with the existing settings', async () => {
        await settingsService.createOrUpdate('exists', { a: 'b' });

        return request(app.getHttpServer())
          .get('/api/settings/exists')
          .expect(200)
          .expect({
            a: 'b',
          });
      });
    });

    describe('POST /api/settings/:name', () => {
      it('should create a new settings', () => {
        return request(app.getHttpServer())
          .post('/api/settings/exists')
          .send({ test: 'working' })
          .expect(200)
          .expect({
            test: 'working',
          });
      });

      it('should update an existing settings', () => {
        request(app.getHttpServer())
          .post('/api/settings/exists')
          .send({ test: 'working' });

        request(app.getHttpServer())
          .post('/api/settings/exists')
          .send({ test: 'updated' })
          .expect(200)
          .expect({
            test: 'updated',
          });
      });
    });
  });
});
