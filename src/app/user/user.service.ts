import { Inject, Injectable } from '@nestjs/common';

import { PRISMA_SERVICE } from '../../services/prisma/constant';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaClient,
  ) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();

    return {
      users,
    };
  }
}
