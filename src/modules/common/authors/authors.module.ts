import { Module, forwardRef } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { AuthorsRepository } from './authors.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, authorSchema } from './entities/author.entity';
import { CommonModule } from '../../../common/common.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    RolesModule,
    MongooseModule.forFeature([{ name: Author.name, schema: authorSchema }]),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
})
export class AuthorsModule {}
