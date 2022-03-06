import { RolesGuard } from './../guard/roles.guard';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RolesGuard],
})
export class UserModule {}
