import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Get all users',
    description:
      'Fetches all users from the database, including vault name, address, balance, and timestamps.',
  },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'All users fetched successfully',
      content: {
        'application/json': {
          example: {
            message: 'All users fetched successfully',
            data: {
              users: [
                {
                  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  name: 'alice',
                  address: '0x1234567890abcdef1234567890abcdef12345678',
                  balance: '1000000000000000000',
                  createdAt: '2026-06-29T10:00:00.000Z',
                  updatedAt: '2026-06-29T12:00:00.000Z',
                },
              ],
            },
            success: true,
            timestamp: new Date().toISOString(),
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
