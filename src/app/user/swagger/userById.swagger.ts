import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Get user by ID',
    description:
      'Fetches a single user from the database by UUID, including vault name, address, balance, and timestamps.',
  },
  params: {
    name: 'id',
    description: 'User ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'User fetched successfully',
      content: {
        'application/json': {
          example: {
            message: 'User fetched successfully',
            data: {
              user: {
                id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                name: 'alice',
                address: '0x1234567890abcdef1234567890abcdef12345678',
                balance: '1',
                createdAt: '2026-06-29T10:00:00.000Z',
                updatedAt: '2026-06-29T12:00:00.000Z',
              },
            },
            success: true,
            timestamp: new Date().toISOString(),
          },
        },
      },
    },
    {
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: 'Not Found',
          },
        },
      },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          },
        },
      },
    },
  ],
};
