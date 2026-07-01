import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PRISMA_SERVICE } from '../../services/prisma/constant';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaClient,
  ) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return {
      users,
    };
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user,
    };
  }
}
