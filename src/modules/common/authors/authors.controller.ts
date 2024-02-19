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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { fieldStructure } from './authors.constants';
import { JwtGuard } from '../../../common/guards/jwt-guards';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Req() request, @Query() params) {
    const filters = {};

    return await this.authorsService.findAll(
      { ...params, ...filters },
      fieldStructure,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne({ _id: id });
  }

  @Post()
  async create(@Req() request, @Body() body: CreateAuthorDto) {
    return await this.authorsService.create({
      ...body,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateAuthorDto) {
    return await this.authorsService.findByIdAndUpdate(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.authorsService.softDelete(id);
  }
}
