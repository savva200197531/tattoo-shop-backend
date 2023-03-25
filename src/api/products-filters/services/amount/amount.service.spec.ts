import { Test, TestingModule } from '@nestjs/testing';
import { AmountService } from './amount.service';

describe('AmountService', () => {
  let service: AmountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmountService],
    }).compile();

    service = module.get<AmountService>(AmountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
