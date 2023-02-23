import { Test, TestingModule } from '@nestjs/testing';
import { ProductsFiltersController } from './products-filters.controller';
import { ProductsFiltersService } from './products-filters.service';

describe('ProductsFiltersController', () => {
  let controller: ProductsFiltersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsFiltersController],
      providers: [ProductsFiltersService],
    }).compile();

    controller = module.get<ProductsFiltersController>(ProductsFiltersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
