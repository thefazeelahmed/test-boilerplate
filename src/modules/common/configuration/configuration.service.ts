import { Injectable } from '@nestjs/common';
import { MongoGenericService } from '../../../common/services/mongo-generic.service';

import { ConfigurationRepository } from './configuration.repository';

@Injectable()
export class ConfigurationService extends MongoGenericService {
  constructor(private readonly orderRepository: ConfigurationRepository) {
    super(orderRepository);
  }
}
