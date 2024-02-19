import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { UserService } from '../../modules/common/user/user.service';
import { UserRepository } from '../../modules/common/user/user.repository';

@Injectable()
export class JwtAuthService {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  verifyJwtToken = async (token) => {
    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );

      const pops = [];

      const currentUser = this.userService.findById(decoded.id, {
        populateFields: pops,
      });

      if (!currentUser) {
        throw new UnauthorizedException(
          'The user belonging to this token does no longer exist.',
        );
      }
      return currentUser;
    } catch (err) {
      throw new UnauthorizedException(
        'Auth token not found or expired , Please login again',
      );
    }
  };

  sign = (params) => {
    return jwt.sign(params, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
}
