import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddToFavoriteDto } from '@/api/favorite/dto/favorite.dto';
import { Favorite } from '@/api/favorite/entities/favorite.entity';
import { JwtAuthGuard } from '@/api/auth/auth.guard';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(
    @Inject(FavoriteService) private readonly favoriteService: FavoriteService,
  ) {}

  @Get(':user_id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<Favorite[]> {
    return this.favoriteService.findAll(user_id);
  }

  @Post(':user_id')
  @UseGuards(JwtAuthGuard)
  addToFavorite(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() body: AddToFavoriteDto,
  ): Promise<Favorite[]> {
    return this.favoriteService.addToFavorite(user_id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteFromFavorite(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return this.favoriteService.remove(id);
  }
}
