import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BookRepository } from './books.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, bookSchema } from './entities/book.entity';
import { RolesModule } from '../roles/roles.module';
import { CommonModule } from '../../../common/common.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    RolesModule,
    MongooseModule.forFeature([{ name: Book.name, schema: bookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService, BookRepository],
})
export class BooksModule {}
