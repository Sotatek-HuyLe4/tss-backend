import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { ChannelDto } from './dtos/channel.dto';
import { NodeChannelResponse } from './types';
import { CACHE_CHANNEL_KEY } from './constant';
import { InitVaultDto } from './dtos/init.dto';
import { ITssNode } from '../../configs/configs.interface';
import { PRISMA_SERVICE } from '../../services/prisma/constant';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class TssService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(PRISMA_SERVICE) private prismaService: PrismaClient,
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
        error?.response?.data?.error,
      );
    }
  }

  async initVault(initVaultDto: InitVaultDto) {
    const { vault, password } = initVaultDto;
    const nodeConfigs = this.configService.get('tss') as ITssNode[];
    const nodeConfigsLength = nodeConfigs.length;

    // check if vault already exists
    const vaultFromDb = await this.prismaService.user.findFirst({
      where: { name: vault },
    });
    if (vaultFromDb) {
      throw new BadRequestException('Vault already exists');
    }

    let payloads: any[] = [];
    for (let i = 0; i < nodeConfigsLength; i++) {
      payloads.push({
        home: nodeConfigs[i].home,
        vault,
        moniker: nodeConfigs[i].home,
        password,
        listen_address: nodeConfigs[i].listenAddress,
      });
    }

    try {
      // try to initialize vault on all tss nodes
      await Promise.all(
        payloads.map((payload, index) =>
          this.httpService.axiosRef.post(
            `${nodeConfigs[index].url}/init`,
            payload,
          ),
        ),
      );

      // save vault to database
      await this.prismaService.user.create({
        data: {
          name: vault,
          address: '',
          balance: '0',
        },
      });

      return {
        vault,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to initialize vault',
        error?.response?.data?.error,
      );
    }
  }
}
