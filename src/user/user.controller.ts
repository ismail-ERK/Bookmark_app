import { RolesGuard } from './../guard/roles.guard';
import { RoleEnum } from './../enums/role.enum';
import { Roles } from './../decorator/role.decorator';
import { User } from '@prisma/client';
import { GetUser } from './../decorator/get-user.decorator';
import { JwtGuard } from './../guard/jwt.guard';
import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/me')
  getCurrentUser(@GetUser('email') email: string) {
    //Request from ExpressJs
    return this.userservice.getOneUser(email);
  }
  //   getCurrentUser(@Req() req: Request) {
  //     //Request from ExpressJs
  //     const { user }: any = req;
  //     return this.userservice.getOneUser(user.email);
  //   }
}
