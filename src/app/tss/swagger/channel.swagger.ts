import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Create TSS channel',
    description:
      'Returns a cached channel ID if one already exists. Otherwise, creates a new channel on TSS node 1 with the given expiration time (in minutes), caches the channel ID with a TTL of (expire - 5) minutes, and returns the new channel ID.',
  },
  body: {
    schema: {
      type: 'object',
      required: ['expire'],
      properties: {
        expire: {
          type: 'number',
          description:
            'Channel expiration time in minutes. Used when creating a new channel and to derive cache TTL as (expire - 5) minutes.',
          example: 30,
          minimum: 1,
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description:
        'Channel ID returned successfully from cache or after creating a new channel on TSS node 1',
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
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid request body',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: ['expire must be a positive number'],
            error: 'Bad Request',
          },
        },
      },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Failed to create channel on TSS node 1',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to create channel',
          },
        },
      },
    },
  ],
};
