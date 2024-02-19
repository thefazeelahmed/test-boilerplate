import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../../../common/repositories/mongo-generic.repository';

import {
  Configuration,
  ConfigurationDocument,
} from './entities/configuration.entity';

export class ConfigurationRepository extends MongoGenericRepository<ConfigurationDocument> {
  constructor(
    @InjectModel(Configuration.name)
    readonly configurationModel: Model<ConfigurationDocument>,
  ) {
    super(configurationModel);
  }
}
