import { Test, TestingModule } from '@nestjs/testing';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';

describe('RssController', () => {
  let rssController: RssController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RssController],
      providers: [RssService],
    }).compile();

    rssController = app.get<RssController>(RssController);
  });

  describe('root', () => {
    it('should return "my generated live mix rss"', () => {
      expect(rssController.get()).toBe('my generated live mix rss');
    });
  });
});
