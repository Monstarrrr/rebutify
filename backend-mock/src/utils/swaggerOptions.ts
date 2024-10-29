import swaggerJSDoc = require('swagger-jsdoc')
import { version } from '../../package.json'
import { MOCK_SERVER_PORT } from '@/utils/config'

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Mock API',
      // Version of the API from package.json
      version,
      description:
        'The mock API server is for implementing and testing new features before developping them in the public API',
    },
    servers: [
      {
        url: `http://localhost:${MOCK_SERVER_PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      parameters: {
        PostType: {
          name: 'postType',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['argument', 'rebuttal', 'comment'],
            example: 'argument',
          },
        },
        PostId: {
          name: 'postId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '1',
          },
        },
        VoteDirection: {
          name: 'voteDirection',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['up', 'down'],
            example: 'upvote',
          },
        },
        Undo: {
          name: 'undo',
          in: 'path',
          required: false,
          schema: {
            type: 'boolean',
            example: true,
          },
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'email',
              example: 'john.doe@email.com',
            },
            password: {
              type: 'password',
              example: 'Passw0rd!',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['argument', 'rebuttal', 'comment'],
              example: 'argument',
            },
            title: {
              type: 'string',
              example: 'Veganism is unatural',
            },
            body: {
              type: 'string',
              example:
                'Veganism is unatural because humans are omnivores, I read it in a book.',
            },
          },
        },
      },
      responses: {
        Ok: {
          description:
            'Response used for successful operations with no returned resource.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: 200,
                  },
                  message: {
                    type: 'string',
                    example: 'Success!',
                  },
                },
              },
            },
          },
        },
        Retrieved: {
          description: 'Response used for successful GET operations.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: 200,
                  },
                  message: {
                    type: 'string',
                    example: 'Resource retrieved.',
                  },
                  resource: {
                    type: 'object',
                    description: 'Returning the retrieved resource.',
                    example: {
                      id: 1,
                      type: 'argument',
                      ownerUserId: 123456,
                      title: 'Veganism is unatural',
                      body: 'Veganism is unatural because humans are omnivores, I read it in a book.',
                      created: '2024-01-01T00:00:00.000Z',
                      updated: '2024-01-01T00:00:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
        Created: {
          description:
            'Response used for successful POST operations that return the resource.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: 201,
                  },
                  message: {
                    type: 'string',
                    example: 'Resource created.',
                  },
                  resources: {
                    type: 'object',
                    description: 'Returning the created resource.',
                    example: {
                      user: {
                        id: 1,
                        username: 'johndoe',
                        email: 'johndoe@email.com',
                      },
                      post: {
                        id: 1,
                        type: 'argument',
                        ownerUserId: 123456,
                        title: 'Veganism is unatural',
                        body: 'Veganism is unatural because humans are omnivores, I read it in a book.',
                        created: '2024-01-01T00:00:00.000Z',
                        updated: '2024-01-01T00:00:00.000Z',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Response used for requests with missing or invalid data.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    example: 'Information is missing or invalid.',
                  },
                },
              },
            },
          },
        },
        BadFormRequest: {
          description:
            'Bad request for form data. The response will contain an object with the fields that have errors.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  // code: {
                  //   type: 'number',
                  //   example: 422,
                  // },
                  // message: {
                  //   type: 'string',
                  //   example: 'Form data is invalid.',
                  // },
                  // resource: {

                  // },
                  email: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Email is already in use'],
                  },
                  password: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: [
                      'Password is too weak',
                      'Password must contain a number',
                    ],
                  },
                  username: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Username already exists'],
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: 401,
                  },
                  message: {
                    type: 'string',
                    example: 'You are not authorized to perform this action.',
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'The error code',
                    example: 404,
                  },
                  message: {
                    type: 'string',
                    description: 'The error message',
                    example: 'Resource not found',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'The error code',
                    example: 500,
                  },
                  message: {
                    type: 'string',
                    description: 'The error message',
                    example: 'Internal server error',
                  },
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Where the OpenAPI specs are located
  apis: ['src/**/*.ts'],
}
