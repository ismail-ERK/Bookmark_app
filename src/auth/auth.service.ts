import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect !!!');
    const verifyPassword = await argon.verify(user.hash, dto.password);
    if (!verifyPassword)
      throw new ForbiddenException('Credentials incorrect !!!!');
    const { id, email } = user;
    const token = await this.signToken(id, email);
    return {
      access_token: token,
    };
  }
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        //P2002 pour duplicate
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
        throw err;
      }
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email: email,
    };
    return this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
