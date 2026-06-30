import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignDto {
  @IsString()
  @IsNotEmpty()
  vault: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  password: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
