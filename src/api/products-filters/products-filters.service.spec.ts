import { Test, TestingModule } from '@nestjs/testing';
import { ProductsFiltersService } from './products-filters.service';

describe('ProductsFiltersService', () => {
  let service: ProductsFiltersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsFiltersService],
    }).compile();

    service = module.get<ProductsFiltersService>(ProductsFiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
