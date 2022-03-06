import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { BookmarkController } from './bookmark/bookmark.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { BookmarkService } from './bookmark/bookmark.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthController, UserController, BookmarkController],
  providers: [AuthService, UserService, BookmarkService],
})
export class AppModule {}
