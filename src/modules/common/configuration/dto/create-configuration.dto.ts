import { IsNotEmpty } from 'class-validator';
import { Schema as mongooseSchema } from 'mongoose';

export class CreateConfigurationDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly value: mongooseSchema.Types.Mixed;
}
