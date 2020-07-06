import { Test, TestingModule } from '@nestjs/testing';

import { DateManagerService } from './date-manager.service';

describe('DateManagerService', () => {
  let dateManagerService: DateManagerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateManagerService],
    }).compile();

    dateManagerService = module.get(DateManagerService);
  });

  describe('getNewDate', () => {
    it('should return a date', () => {
      expect(dateManagerService.getNewDate()).toBeInstanceOf(Date);
    });
  });
});
