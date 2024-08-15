import * as dotenv from 'dotenv'
import swaggerJSDoc = require('swagger-jsdoc')
import { version } from '../../package.json'
dotenv.config()

export const MOCK_SERVER_PORT = 3001
export const JWT_SECRET = process.env.MOCK_JWT_SECRET
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': '*' },
  { 'Access-Control-Allow-Methods': '*' },
  { 'Access-Control-Allow-Headers': '*' },
]
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: "The user's username",
              example: 'johndoe',
            },
            email: {
              type: 'email',
              description: "The user's email address",
              example: 'john.doe@email.com',
            },
            password: {
              type: 'password',
              description: "The user's password",
              example: 'Passw0rd!',
            },
          },
        },
      },
      responses: {
        Ok: {
          description: 'Ok response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'The success code',
                    example: 200,
                  },
                  message: {
                    type: 'string',
                    description: 'The success message',
                    example: 'Success!',
                  },
                },
              },
            },
          },
        },
        Created: {
          description: 'Resource created response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'The success code',
                    example: 201,
                  },
                  message: {
                    type: 'string',
                    description: 'The success message',
                    example: 'Resource created',
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
                    description: 'The error code',
                    example: 401,
                  },
                  message: {
                    type: 'string',
                    description: 'The error message',
                    example: 'Unauthorized',
                  },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    description: 'The error code',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    description: 'The error message',
                    example: 'Bad request',
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
  apis: ['src/routes/*.ts', 'src/schema/*.ts', 'src/controllers/*.ts'],
}
