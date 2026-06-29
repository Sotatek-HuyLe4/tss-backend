import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Initialize TSS vault',
    description:
      'Initializes the vault on all three TSS nodes in parallel. Each index in `homes` and `listenAddresses` maps to a TSS node (node 1, node 2, node 3) and is sent as a POST /init payload with `home`, `vault`, `moniker`, `password`, and `listen_address`.',
  },
  body: {
    schema: {
      type: 'object',
      required: ['homes', 'vault', 'password', 'listenAddresses'],
      properties: {
        homes: {
          type: 'array',
          description:
            'Home directory paths for each TSS node. Index 0 maps to node 1, index 1 to node 2, and index 2 to node 3.',
          items: {
            type: 'string',
          },
          example: ['node1', 'node2', 'node3'],
        },
        vault: {
          type: 'string',
          description: 'Vault name or path shared across all TSS nodes',
          example: 'alice',
        },
        password: {
          type: 'string',
          description: 'Vault password (minimum 9 characters)',
          example: '123456789',
          minLength: 9,
        },
        listenAddresses: {
          type: 'array',
          description:
            'Listen addresses for each TSS node. Must align by index with `homes`.',
          items: {
            type: 'string',
          },
          example: [
            '/ip4/0.0.0.0/tcp/10000',
            '/ip4/0.0.0.0/tcp/20000',
            '/ip4/0.0.0.0/tcp/30000',
          ],
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Vault initialized successfully on all TSS nodes',
      content: {
        'application/json': {
          example: {
            message: 'Vault initialized successfully',
            data: {
              vault: 'alice',
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
            message: ['password must be longer than or equal to 9 characters'],
            error: 'Bad Request',
          },
        },
      },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Failed to initialize vault on one or more TSS nodes',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to initialize vault',
          },
        },
      },
    },
  ],
};
