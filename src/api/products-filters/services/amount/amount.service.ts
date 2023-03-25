import { ArrayContains, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amount } from '@/api/products-filters/entities/amount.entity';
import {
  CreateAmountDto,
  UpdateAmountDto,
} from '@/api/products-filters/dto/amount.dto';

@Injectable()
export class AmountService {
  constructor(
    @InjectRepository(Amount)
    private readonly repository: Repository<Amount>,
  ) {}

  findAll(): Promise<Amount[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findAllWithFilters(category_id: number): Promise<Amount[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
      where: {
        category_ids: ArrayContains([category_id]),
      },
    });
  }

  findOne(id: number): Promise<Amount> {
    return this.repository.findOneBy({ id });
  }

  async create(params: CreateAmountDto): Promise<Amount> {
    const newAmount = this.repository.create(params);

    return this.repository.save(newAmount);
  }

  async update(id: number, params: UpdateAmountDto): Promise<UpdateResult> {
    return this.repository.update({ id }, params);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
