module.exports = {
  description: 'A service to login',
  definitions: {
    loginRequest: {
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
        }
      }
    },
    loginResponse: {
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
    description: 'Returns access token for authorized users',
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
          $ref: '#/definitions/loginRequest'
        }
      }
    ],
    responses: {
      201: {
        description: 'created',
        schema: {
          $ref: '#/definitions/loginResponse'
        }
      },
      400: { description: 'invalid request body' },
      403: { description: 'forbidden' },
      500: { description: 'general error' }
    }
  }
};
