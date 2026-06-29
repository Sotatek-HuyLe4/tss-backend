import { IsNumber, IsPositive } from 'class-validator';

export class ChannelDto {
  @IsNumber()
  @IsPositive()
  expire: number;
}
