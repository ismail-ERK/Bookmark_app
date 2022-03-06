import { ROLES_KEY } from './../decorator/role.decorator';
import { RoleEnum } from './../enums/role.enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles) {
      const requireRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requireRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();

      return requireRoles.some((role) => user.role?.includes(role));
    }
  }
}
