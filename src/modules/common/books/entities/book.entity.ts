import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author' })
  author: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const bookSchema = SchemaFactory.createForClass(Book);
