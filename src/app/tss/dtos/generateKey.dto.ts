import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class GenerateKeyDto {
  @IsString()
  @IsNotEmpty()
  vault: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  password: string;

  @IsNumber()
  @IsPositive()
  parties: number;

  @IsNumber()
  @IsPositive()
  threshold: number;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
