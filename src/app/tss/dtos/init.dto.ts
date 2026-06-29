import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InitVaultDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  homes: string[];

  @IsString()
  @IsNotEmpty()
  vault: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  password: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  listenAddresses: string[];
}
