import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public language: string;
}
