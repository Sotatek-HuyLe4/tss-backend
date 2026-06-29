import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Create TSS channel',
    description:
      'Create a new TSS channel with the given expiration time, or return the cached channel if one already exists',
  },
  body: {
    schema: {
      type: 'object',
      required: ['expire'],
      properties: {
        expire: {
          type: 'number',
          description: 'Channel expiration time in minutes',
          example: 30,
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Channel created successfully',
      content: {
        'application/json': {
          example: {
            message: 'Channel created successfully',
            data: {
              channelId: '6586A42455B',
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
            message: 'Internal server error',
            data: null,
            success: false,
            timestamp: new Date().toISOString(),
          },
        },
      },
    },
  ],
};
