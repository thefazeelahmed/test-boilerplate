import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoGenericService } from '../../../common/services/mongo-generic.service';

import { UserRepository } from './user.repository';
import { USER_ROLE } from './user.constants';

@Injectable()
export class UserService extends MongoGenericService {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async roleBaseFilters(role: USER_ROLE, user) {
    console.log(role, user); //just to avoid unused variable warning , will remove this once put logic here
    switch (role) {
      case USER_ROLE.ADMIN:
        return {};
      case USER_ROLE.USER:
        return {};
      default:
        throw new BadRequestException('Invalid Roles');
    }
  }
}
