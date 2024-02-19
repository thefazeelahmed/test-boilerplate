import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { POPULATES, fieldStructure } from './books.constants';
import { GetBookDto } from './dto/get-book.dto';
import { JwtGuard } from '../../../common/guards/jwt-guards';
import { RolesGuard } from '../../../common/guards/roles.guards';
import { Permissions } from '../../../common/decorators/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Permissions('product.create')
  @Get()
  async findAll(@Req() request, @Query() params: GetBookDto) {
    const filters = {};

    return await this.booksService.findAll(
      { ...params, ...filters, populateFields: POPULATES },
      fieldStructure,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOne({ _id: id });
  }

  @Post()
  async create(@Req() request, @Body() body: CreateBookDto) {
    return await this.booksService.create({
      ...body,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateBookDto) {
    return await this.booksService.findByIdAndUpdate(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.booksService.softDelete(id);
  }
}
