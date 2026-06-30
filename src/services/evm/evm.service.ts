import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from 'ethers';

@Injectable()
export class EvmService extends JsonRpcProvider {
  constructor(private readonly configService: ConfigService) {
    const rpcUrl = configService.get('rpcUrls.evm');

    super(rpcUrl);
  }
}
