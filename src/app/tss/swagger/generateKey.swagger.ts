import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Generate TSS key',
    description:
      'Generates a distributed key for an existing vault on all configured TSS nodes in parallel by sending POST /keygen to each node. Per-node `home` is read from server config. Validates that `parties` equals the number of configured TSS nodes, `threshold` is less than or equal to `parties`, and the vault exists in the database. On success, saves the generated address to the database and returns the address and public key.',
  },
  body: {
    schema: {
      type: 'object',
      required: ['vault', 'password', 'parties', 'threshold', 'channelId'],
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
        parties: {
          type: 'number',
          description:
            'Number of parties participating in key generation. Must equal the number of configured TSS nodes.',
          example: 3,
          minimum: 1,
        },
        threshold: {
          type: 'number',
          description:
            'Minimum number of parties required to sign. Must be less than or equal to `parties`.',
          example: 1,
          minimum: 1,
        },
        channelId: {
          type: 'string',
          description:
            'Channel ID returned from the create channel API, used for TSS node communication.',
          example: '6586A42455B',
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description:
        'Key generated successfully on all TSS nodes and address saved to the database',
      content: {
        'application/json': {
          example: {
            message: 'Key generated successfully',
            data: {
              address: '0x1234567890abcdef1234567890abcdef12345678',
              pubkey: '04abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
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
        'Invalid request body, vault does not exist, or parties/threshold validation failed',
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
            invalidParties: {
              summary: 'Parties mismatch',
              value: {
                statusCode: HttpStatus.BAD_REQUEST,
                message:
                  'Parties must be equal to the number of TSS nodes: 3',
                error: 'Bad Request',
              },
            },
            invalidThreshold: {
              summary: 'Threshold too high',
              value: {
                statusCode: HttpStatus.BAD_REQUEST,
                message:
                  'Threshold must be less than or equal to the number of parties',
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
      description: 'Failed to generate key on one or more TSS nodes',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to generate key',
          },
        },
      },
    },
  ],
};
