import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoGenericService } from '../../../common/services/mongo-generic.service';
import { AuthorsRepository } from './authors.repository';
import { USER_ROLE } from '../user/user.constants';

@Injectable()
export class AuthorsService extends MongoGenericService {
  constructor(private readonly authorRepository: AuthorsRepository) {
    super(authorRepository);
  }

  roleBaseFilters(role: USER_ROLE, user) {
    console.log(user);
    switch (role) {
      case USER_ROLE.ADMIN: {
        return {};
      }

      case USER_ROLE.USER:
        return {};

      default:
        throw new BadRequestException('Invalid Roles');
    }
  }
}
