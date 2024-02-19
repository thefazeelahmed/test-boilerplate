import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { RolesModule } from './roles/roles.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  controllers: [CommonController],
  providers: [CommonService],
  imports: [RolesModule, BooksModule, AuthorsModule],
})
export class CommonModule {}
