import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../../../common/repositories/mongo-generic.repository';
import { Book, BookDocument } from './entities/book.entity';

export class BookRepository extends MongoGenericRepository<BookDocument> {
  constructor(
    @InjectModel(Book.name)
    readonly model: Model<BookDocument>,
  ) {
    super(model);
  }
}
