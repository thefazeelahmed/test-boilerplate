// roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../modules/common/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredRoles && !requiredPermissions) {
      return true; // No specific roles or permissions required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userRoles: string[] = request.user?.permissions || [];

    if (requiredRoles && !this.checkRoles(userRoles, requiredRoles)) {
      throw new ForbiddenException('Insufficient Roles');
    }

    if (requiredPermissions) {
      const userPermissions: string[] = request.user?.permissions || [];
      if (!this.checkPermissions(userPermissions, requiredPermissions)) {
        // If not found in user's permissions, check in role's permissions
        const { data: role } = await this.roleService.findAll({
          name: { $in: userRoles },
        });

        if (
          role &&
          role.permissions &&
          this.checkPermissions(role.permissions, requiredPermissions)
        ) {
          return true;
        }

        throw new ForbiddenException('Insufficient Permissions');
      }
    }

    return true;
  }

  private checkRoles(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  private checkPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
