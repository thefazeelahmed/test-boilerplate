import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

export type ConfigurationDocument = HydratedDocument<Configuration>;
@Schema({ timestamps: true })
export class Configuration {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  value: mongooseSchema.Types.Mixed;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
