import { IntersectionType } from '@nestjs/mapped-types';
import { FeaturesDto } from '../../../../common/dtos/features.dto';
import {
  FilterProperties,
  createGenericFilterDto,
} from '../../../../common/dtos/get-response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { PopulateFieldsDto } from '../../../../common/dtos/populate.dto';

const properties: FilterProperties = {
  name: 'string',
  lang: 'string',
};

const dto = createGenericFilterDto(properties);

export class GetAuthorDto extends IntersectionType(
  dto,
  FeaturesDto,
  PaginationDto,
  PopulateFieldsDto,
) {}
