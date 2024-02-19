import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({
    type: [
      {
        permission: { type: MongooseSchema.Types.ObjectId, ref: 'Permission' },
        methods: [String],
      },
    ],
    default: [],
  })
  permissions: { permission: string; methods: string[] }[];
}

export const roleSchema = SchemaFactory.createForClass(Role);
