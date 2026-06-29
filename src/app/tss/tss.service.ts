import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { ChannelDto } from './dtos/channel.dto';
import { NodeChannelResponse } from './types';
import { CACHE_CHANNEL_KEY } from './constant';

@Injectable()
export class TssService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createChannel(channelDto: ChannelDto) {
    const { expire } = channelDto;

    // check if channel already has cached
    const cachedChannel =
      await this.cacheManager.get<NodeChannelResponse>(CACHE_CHANNEL_KEY);
    if (cachedChannel) {
      return {
        channelId: cachedChannel.channel_id,
      };
    }

    // create channel
    try {
      const res = await this.httpService.axiosRef.post(
        `${this.configService.get('tss.node1Url')}/channel`,
        { expire },
      );
      const { channel_id: channelId } = res.data.data as NodeChannelResponse;

      // save channel to cache
      await this.cacheManager.set(
        CACHE_CHANNEL_KEY,
        { channel_id: channelId },
        (expire - 5) * 60 * 1_000,
      );

      return {
        channelId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create channel',
        error.response.data,
      );
    }
  }
}
