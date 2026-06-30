import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SwaggerDecorator } from '../../common/decorators/swagger.decorator';
import { TssService } from './tss.service';
import { ChannelDto, InitVaultDto } from './dtos';
import {
  createChannelSwagger,
  initVaultSwagger,
  generateKeySwagger,
  signSwagger,
} from './swagger';
import { GenerateKeyDto } from './dtos/generateKey.dto';
import { SignDto } from './dtos/sign.dto';

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

  @Post('init-vault')
  @SwaggerDecorator({
    operations: initVaultSwagger.operations,
    body: initVaultSwagger.body,
    responses: initVaultSwagger.responses,
  })
  async initVault(@Body() initVaultDto: InitVaultDto) {
    const data = await this.tssService.initVault(initVaultDto);

    return {
      data,
      message: 'Vault initialized successfully',
    };
  }

  @Post('generate-key')
  @SwaggerDecorator({
    operations: generateKeySwagger.operations,
    body: generateKeySwagger.body,
    responses: generateKeySwagger.responses,
  })
  async generateKey(@Body() generateKeyDto: GenerateKeyDto) {
    const data = await this.tssService.generateKey(generateKeyDto);

    return {
      data,
      message: 'Key generated successfully',
    };
  }

  @Post('sign')
  @SwaggerDecorator({
    operations: signSwagger.operations,
    body: signSwagger.body,
    responses: signSwagger.responses,
  })
  async sign(@Body() signDto: SignDto) {
    const data = await this.tssService.sign(signDto);

    return {
      data,
      message: 'Signature generated successfully',
    };
  }
}
