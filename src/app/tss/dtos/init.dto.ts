import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InitVaultDto {
  @IsString()
  @IsNotEmpty()
  vault: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  password: string;
}
