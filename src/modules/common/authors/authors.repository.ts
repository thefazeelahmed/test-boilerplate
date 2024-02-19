import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../../../common/repositories/mongo-generic.repository';
import { Author, AuthorDocument } from './entities/author.entity';

export class AuthorsRepository extends MongoGenericRepository<AuthorDocument> {
  constructor(
    @InjectModel(Author.name)
    readonly model: Model<AuthorDocument>,
  ) {
    super(model);
  }
}
