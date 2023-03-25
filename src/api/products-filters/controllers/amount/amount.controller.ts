import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AmountService } from '@/api/products-filters/services/amount/amount.service';
import {
  AmountFiltersDto,
  CreateAmountDto,
  UpdateAmountDto,
} from '@/api/products-filters/dto/amount.dto';
import { Amount } from '@/api/products-filters/entities/amount.entity';

@Controller('amount')
export class AmountController {
  constructor(private readonly amountService: AmountService) {}

  @Get()
  findAll(@Query() query: AmountFiltersDto): Promise<Amount[]> {
    if (Object.values(query).length) {
      return this.amountService.findAllWithFilters(+query.category_id);
    }
    return this.amountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Amount> {
    return this.amountService.findOne(id);
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  create(@Body() body: CreateAmountDto): Promise<Amount> {
    return this.amountService.create(body);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAmountDto,
  ): Promise<UpdateResult> {
    return this.amountService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.amountService.remove(id);
  }
}
