import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Sign and broadcast EVM transaction',
    description:
      'Signs an EVM transfer transaction for an existing vault using the first two configured TSS nodes in parallel by sending POST /sign to each node. Per-node `home` and `rpc_url` are read from server config; the request supplies `vault`, `password`, `channelId`, `toAddress`, and `amount`. On success, broadcasts the signed raw transaction to the EVM network, waits for confirmation, and returns the transaction hash.',
  },
  body: {
    schema: {
      type: 'object',
      required: ['vault', 'password', 'channelId', 'toAddress', 'amount'],
      properties: {
        vault: {
          type: 'string',
          description: 'Vault name. Must already exist in the database.',
          example: 'alice',
        },
        password: {
          type: 'string',
          description: 'Vault password (minimum 9 characters)',
          example: '123456789',
          minLength: 9,
        },
        channelId: {
          type: 'string',
          description:
            'Channel ID returned from the create channel API, used for TSS node communication.',
          example: '6586A42455B',
        },
        toAddress: {
          type: 'string',
          description: 'Recipient EVM address for the transfer',
          example: '0x96216849c49358B10257cb55b28eA603c874b05E',
        },
        amount: {
          type: 'string',
          description: 'Transfer amount in ETH (as a string)',
          example: '1',
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description:
        'Transaction signed on TSS nodes, broadcast to the EVM network, and confirmed',
      content: {
        'application/json': {
          example: {
            message: 'Signature generated successfully',
            data: {
              txHash:
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            },
            success: true,
            timestamp: new Date().toISOString(),
          },
        },
      },
    },
    {
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid request body or vault does not exist in the database',
      content: {
        'application/json': {
          examples: {
            vaultDoesNotExist: {
              summary: 'Vault does not exist',
              value: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Vault does not exist',
                error: 'Bad Request',
              },
            },
            validationError: {
              summary: 'Validation error',
              value: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: [
                  'password must be longer than or equal to 9 characters',
                ],
                error: 'Bad Request',
              },
            },
          },
        },
      },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Failed to sign on TSS nodes or broadcast the transaction to the EVM network',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to sign',
          },
        },
      },
    },
  ],
};
