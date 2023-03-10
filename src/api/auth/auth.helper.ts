import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Injectable, HttpException, HttpStatus, UnauthorizedException, Inject } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/user/entities/user.entity';

@Injectable()
export class AuthHelper {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @Inject(JwtService) private readonly jwtService: JwtService
  ) {

  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<any> {
    return this.jwtService.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    return this.repository.findOneBy({ id: decoded.id });
  }

  // Generate JWT Token
  public generateToken(user: User): string {
    return this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwtService.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
