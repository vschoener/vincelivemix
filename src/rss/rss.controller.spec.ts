import { Test, TestingModule } from '@nestjs/testing';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';

describe('RssController', () => {
  let rssController: RssController;
  let rssServiceMocked: jest.Mocked<RssService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RssController],
      providers: [{
        provide: RssService,
        useValue: {
          generate: jest.fn()
        }
      }],
    }).compile();

    rssController = app.get<RssController>(RssController);
    rssServiceMocked = app.get(RssService);
  });

  describe('root', () => {
    it('should return "my generated live mix rss"', async () => {
      rssServiceMocked.generate.mockResolvedValue('my generated live mix rss');
      expect(await rssController.generate()).toBe('my generated live mix rss');
    });
  });
});
