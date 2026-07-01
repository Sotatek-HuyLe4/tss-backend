import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { GenerateKeyDto } from './dtos/generateKey.dto';
import { SignDto } from './dtos/sign.dto';
import { EvmService } from '../../services/evm/evm.service';

@Injectable()
export class TssService {
  private readonly logger = new Logger(TssService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly evmService: EvmService,
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
      const nodeConfig = this.configService.get('tss')[0] as ITssNode;
      const res = await this.httpService.axiosRef.post(
        `${nodeConfig.url}/channel`,
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
      this.logger.error(error);

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
          balance: '',
        },
      });

      return {
        vault,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to initialize vault',
        error?.response?.data?.error,
      );
    }
  }

  async generateKey(generateKeyDto: GenerateKeyDto) {
    const { vault, password, parties, threshold, channelId } = generateKeyDto;
    const nodeConfigs = this.configService.get('tss') as ITssNode[];
    const nodeConfigsLength = nodeConfigs.length;

    // check if parties is equal to node configs length
    if (parties !== nodeConfigsLength) {
      throw new BadRequestException(
        `Parties must be equal to the number of TSS nodes: ${nodeConfigsLength}`,
      );
    }

    // check if threshold is greater than parties
    if (threshold > parties) {
      throw new BadRequestException(
        'Threshold must be less than or equal to the number of parties',
      );
    }

    // check if vault exists
    const user = await this.prismaService.user.findFirst({
      where: { name: vault },
    });
    if (!user) {
      throw new BadRequestException('Vault does not exist');
    }

    let payloads: any[] = [];
    for (let i = 0; i < nodeConfigsLength; i++) {
      payloads.push({
        home: nodeConfigs[i].home,
        vault,
        password,
        parties,
        threshold,
        channel_id: channelId,
      });
    }

    try {
      // try to generate key on all tss nodes
      const res = await Promise.all(
        payloads.map((payload, index) =>
          this.httpService.axiosRef.post(
            `${nodeConfigs[index].url}/keygen`,
            payload,
          ),
        ),
      );
      const { address, pubkey } = res[0].data.data;

      // save address to database
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { address },
      });

      return {
        address,
        pubkey,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to generate key',
        error?.response?.data?.error,
      );
    }
  }

  async sign(signDto: SignDto) {
    const { vault, password, channelId, toAddress, amount } = signDto;
    const nodeConfigs = this.configService.get('tss').slice(0, 2) as ITssNode[];
    const nodeConfigsLength = nodeConfigs.length;

    // check if vault exists
    const user = await this.prismaService.user.findFirst({
      where: { name: vault },
    });
    if (!user) {
      throw new BadRequestException('Vault does not exist');
    }

    let payloads: any[] = [];
    for (let i = 0; i < nodeConfigsLength; i++) {
      payloads.push({
        home: nodeConfigs[i].home,
        vault,
        password,
        channel_id: channelId,
        rpc_url: this.configService.get('rpcUrls.evm'),
        to_address: toAddress,
        amount,
      });
    }

    try {
      // try to sign on all tss nodes
      const res = await Promise.all(
        payloads.map((payload, index) =>
          this.httpService.axiosRef.post(
            `${nodeConfigs[index].url}/sign`,
            payload,
          ),
        ),
      );
      const { raw_tx: rawTx } = res[0].data.data;

      // try to broadcast raw tx to evm network
      const tx = await this.evmService.broadcastTransaction(rawTx);
      await tx.wait();

      return {
        txHash: tx.hash,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Failed to sign',
        error?.response?.data?.error,
      );
    }
  }
}
