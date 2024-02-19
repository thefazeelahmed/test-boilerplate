import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public author: string;

  @IsOptional()
  public language: string;
}
