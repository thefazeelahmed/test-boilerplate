import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoGenericService } from '../../../common/services/mongo-generic.service';
import { BookRepository } from './books.repository';
import { USER_ROLE } from '../user/user.constants';

@Injectable()
export class BooksService extends MongoGenericService {
  constructor(private readonly bookRepository: BookRepository) {
    super(bookRepository);
  }

  roleBaseFilters(role: USER_ROLE, user) {
    console.log(user);
    switch (role) {
      case USER_ROLE.ADMIN:
        return {};
      default:
        throw new BadRequestException('Invalid Roles');
    }
  }
}
