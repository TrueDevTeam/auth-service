module.exports = {
  description: 'A service to put sign-up',
  definitions: {
    registerRequest: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        email: {
          type: 'string',
          description: 'User\'s email'
        },
        password: {
          type: 'string',
          description: 'User\'s password'
        },
        phone: {
          type: 'string',
          description: 'User\'s phone'
        },
        avatarUrl: {
          type: 'string',
          description: 'URL of user\'s avatar image'
        },
        lang: {
          type: 'string',
          description: 'User\'s language'
        },
        name: {
          type: 'string',
          description: 'Username'
        },
        abbr: {
          type: 'string',
          description: 'Abbreviation'
        },
        color: {
          type: 'string',
          description: 'Color'
        },
        pin: {
          type: 'string',
          description: 'PIN'
        },
        client: {
          type: 'object',
          required: [
            'text'
          ],
          properties: {
            name: {
              type: 'string',
              description: 'Client\'s name'
            },
            lang: {
              type: 'string',
              description: 'Client\'s language'
            },
            phone: {
              type: 'string',
              description: 'Client\'s phone'
            },
            address: {
              type: 'string',
              description: 'Client\'s address'
            },
            country: {
              type: 'string',
              description: 'Client\'s country'
            },
            taxData: {
              type: 'object',
              description: 'Client\'s tax data'
            }
          }
        }
      }
    },
    registerResponse: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        token: {
          type: 'string',
          description: 'Access token'
        }
      }
    }
  },
  create: {
    description: 'Endpoint to sign-up. Returns access token',
    parameters: [
      {
        name: 'User-agent',
        description: 'User agent',
        in: 'headers',
        required: true
      },
      {
        name: 'X-device-user-agent',
        description: 'Name of device',
        in: 'headers',
        required: true
      },
      {
        name: 'Request body',
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/registerRequest'
        }
      }
    ],
    responses: {
      201: {
        description: 'created',
        schema: {
          $ref: '#/definitions/registerResponse'
        }
      },
      400: { description: 'invalid request body or such user already exists' },
      500: { description: 'general error' }
    }
  }
};
