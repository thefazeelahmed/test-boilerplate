import { PaginatedApiResponseDto } from '../dtos/api-response.dto';
import { GenericMutationResponseDto } from '../dtos/mutation-api-response.dto';
import { APIFeatures } from '../helper/apiFeatures';
import { IFieldsStructure } from '../types';

export abstract class MongoGenericService {
  constructor(protected readonly repository) {}

  constructFindAllQuery(params, fieldsStructure) {
    const filter = APIFeatures.filter(params, fieldsStructure);

    const select = APIFeatures.select(params);
    const sort = APIFeatures.sort(params);

    const { limit, skip } = APIFeatures.paginate(params);

    return { filter, select, sort, limit, skip };
  }

  async findAll(
    params,
    fieldsStructure: IFieldsStructure = {
      searchFields: [],
      numericFields: [],
      objectIdFields: [],
      stringFields: [],
    },
  ) {
    try {
      const { filter, select, sort, limit, skip } = this.constructFindAllQuery(
        params,
        fieldsStructure,
      );

      const items = await this.repository.findAll(
        { isDeleted: false, language: filter.language || 'en', ...filter },
        select,
        sort,
        limit,
        skip,
        params.populateFields,
      );

      const totalItems = await this.countDocuments({
        isDeleted: false,
        language: filter.language || 'en',
        ...filter,
      });

      const totalPages = Math.ceil(totalItems / (limit || 1));
      const currentPage = Math.ceil((skip || 0) / (limit || 1)) + 1;

      return new PaginatedApiResponseDto(
        items,
        currentPage,
        totalPages,
        limit,
        totalItems,
        null,
        '',
      );
    } catch (error) {
      return new PaginatedApiResponseDto(
        [],
        0,
        0,
        0,
        0,
        error.message,
        '',
        false,
      );
    }
  }

  // constructFindOneQuery(params) {
  //   const filter = APIFeatures.filterOne(params);
  //   const select = APIFeatures.select(params);
  //   const sort = APIFeatures.sort(params);

  //   return { filter, select, sort };
  // }

  countDocuments(filter) {
    return this.repository.countDocuments(filter);
  }

  async findOne(
    params,
    fieldsStructure: IFieldsStructure = {
      searchFields: [],
      numericFields: [],
      objectIdFields: [],
      stringFields: [],
    },
  ) {
    const { filter, select, sort } = this.constructFindAllQuery(
      params,
      fieldsStructure,
    );

    return this.repository.findOne(
      { isDeleted: false, language: filter.language || 'en', ...filter },
      select,
      sort,
      params.populateFields,
    );
  }

  async findById(
    id,
    params,
    fieldsStructure: IFieldsStructure = {
      searchFields: [],
      numericFields: [],
      objectIdFields: [],
      stringFields: [],
    },
  ) {
    const { select } = this.constructFindAllQuery(params, fieldsStructure);

    return this.repository.findById(id, params.populateFields, select);
  }

  async create(createEntityData: unknown) {
    const createdEntity = await this.repository.create(createEntityData);
    return new GenericMutationResponseDto(
      true,
      'Entity created successfully.',
      createdEntity,
    );
  }

  async findByIdAndUpdate(id: string, updateEntityData) {
    const result = await this.repository.findByIdAndUpdate(
      id,
      updateEntityData,
      {
        new: true,
      },
    );

    return new GenericMutationResponseDto(
      true,
      'Entity updated successfully.',
      result,
    );
  }

  async updateOne(filter, updated, options): Promise<unknown> {
    const result = await this.repository.updateOne(filter, updated, options);
    return new GenericMutationResponseDto(
      true,
      'Entity updated successfully.',
      result,
    );
  }

  async updateMany(filter, updated, options) {
    return this.repository.updateMany(filter, updated, options);
  }

  async deleteMany(entityFilterQuery) {
    await this.repository.deleteMany(entityFilterQuery);
    return new GenericMutationResponseDto(
      true,
      'Entities deleted successfully.',
    );
  }

  async softDelete(id: string) {
    await this.repository.findByIdAndUpdate(id, { isDeleted: true });
    return new GenericMutationResponseDto(
      true,
      'Entity soft deleted successfully.',
    );
  }

  async softDeleteMany(ids: string[]) {
    await this.repository.updateMany(ids, { isDeleted: true });
    return new GenericMutationResponseDto(
      true,
      'Entity soft deleted successfully.',
    );
  }
}
