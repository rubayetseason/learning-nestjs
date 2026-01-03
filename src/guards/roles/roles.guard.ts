import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enums';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user role from request (assuming it's set in request headers for this example)
    const request = context.switchToHttp().getRequest<Request>();
    // In a real application, you would extract the user role from the authenticated user object
    const userRole = request.headers['user-role'] as Role | undefined;

    // If user role is not provided → deny access
    if (!userRole) {
      throw new UnauthorizedException('User role not provided');
    }

    // Check if user has one of the required roles
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Access denied. Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
