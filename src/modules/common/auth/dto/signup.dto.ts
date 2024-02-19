import { IsNotEmpty, IsOptional } from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  readonly referralCode: string;

  @IsNotEmpty()
  readonly password: string;
}
