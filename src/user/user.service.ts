import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getOneUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user !== null) {
      delete user.hash;
      return user;
    } else {
      throw new ForbiddenException('User does not exist');
    }
  }
}
