import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SwaggerDecorator } from '../../common/decorators/swagger.decorator';
import { TssService } from './tss.service';
import { ChannelDto } from './dtos/channel.dto';
import { createChannelSwagger } from './swagger';

@Controller('tss')
@ApiTags('TSS')
export class TssController {
  constructor(private readonly tssService: TssService) {}

  @Post('channel')
  @SwaggerDecorator({
    operations: createChannelSwagger.operations,
    body: createChannelSwagger.body,
    responses: createChannelSwagger.responses,
  })
  async createChannel(@Body() channelDto: ChannelDto) {
    const data = await this.tssService.createChannel(channelDto);

    return {
      data,
      message: 'Channel created successfully',
    };
  }
}
