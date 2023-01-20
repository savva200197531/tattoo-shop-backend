import { Request } from 'express';

import {
  ClassSerializerInterceptor,
  Controller,
  Req,
  UseGuards,
  UseInterceptors,
  Put,
  Body,
  Inject,
  Get,
  Param,
  ParseIntPipe
} from "@nestjs/common";
import { JwtAuthGuard } from "@/api/auth/auth.guard";

import { UpdateNameDto } from "./dto/user.dto";
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly service: UserService,
  ) {}

  @Put('name')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateName(@Body() body: UpdateNameDto, @Req() req: Request): Promise<User> {
    return this.service.updateName(body, req);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  private findUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.findUser(id)
  }
}
