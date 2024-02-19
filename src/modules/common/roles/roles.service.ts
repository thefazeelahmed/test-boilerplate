import { Injectable } from '@nestjs/common';
import { MongoGenericService } from '../../../common/services/mongo-generic.service';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RolesService extends MongoGenericService {
  constructor(private readonly roleRepository: RoleRepository) {
    super(roleRepository);
  }
}
