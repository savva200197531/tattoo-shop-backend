import { Repository } from 'typeorm';
import { Request } from 'express';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateNameDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async updateName(body: UpdateNameDto, req: Request): Promise<User> {
    const user: User = <User>req.user;

    user.name = body.name;

    return this.userRepository.save(user);
  }

  public findUser(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cart.product', 'favorite.product']
    })
  }

  public findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    })
  }

  public async markEmailAsConfirmed(email: string) {
    return this.userRepository.update({ email }, {
      isEmailConfirmed: true
    });
  }
}
