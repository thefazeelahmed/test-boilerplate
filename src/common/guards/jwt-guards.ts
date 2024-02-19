import { UnauthorizedException } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtAuthService } from 'common/services/jwt-auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  @Inject(JwtAuthService)
  private readonly jwtAuthService: JwtAuthService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    let token;
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Token Not Provided');
    }
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new UnauthorizedException('Not Logged In');
    }
    const user = await this.jwtAuthService.verifyJwtToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid Jwt Token');
    }

    req.user = user;

    return true;
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
}
