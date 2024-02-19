import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { USER_ROLE } from '../user.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: USER_ROLE.ADMIN })
  role: USER_ROLE;

  @Prop()
  passwordResetToken: number;

  @Prop()
  passwordResetTokenExpiresAt: Date;

  @Prop()
  passwordUpdatedAt: Date;

  @Prop()
  emailVerificationToken: number;

  @Prop({ default: Date.now() + 10 * 60 * 1000 })
  emailVerificationTokenExpiresAt: Date;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: true })
  isLoginEnabled: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //this.activationCode = await bcrypt.hash(this.activationCode, 12);
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ $and: [{ isActive: { $ne: false }, isDeleted: { $ne: true } }] });
  next();
});
