import { HttpStatus } from '@nestjs/common';

export default {
  operations: {
    summary: 'Initialize TSS vault',
    description:
      'Checks whether the vault name already exists in the database. If not, initializes the vault on all configured TSS nodes in parallel by sending POST /init to each node. Per-node `home`, `moniker`, and `listen_address` values are read from server config; the request only supplies `vault` and `password`. On success, persists the vault to the database and returns the vault name.',
  },
  body: {
    schema: {
      type: 'object',
      required: ['vault', 'password'],
      properties: {
        vault: {
          type: 'string',
          description:
            'Vault name shared across all TSS nodes. Must be unique in the database.',
          example: 'alice',
        },
        password: {
          type: 'string',
          description: 'Vault password (minimum 9 characters)',
          example: '123456789',
          minLength: 9,
        },
      },
    },
  },
  responses: [
    {
      status: HttpStatus.OK,
      description:
        'Vault initialized successfully on all TSS nodes and saved to the database',
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
      description:
        'Invalid request body or vault name already exists in the database',
      content: {
        'application/json': {
          examples: {
            vaultAlreadyExists: {
              summary: 'Vault already exists',
              value: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Vault already exists',
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
