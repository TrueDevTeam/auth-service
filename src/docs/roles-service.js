module.exports = {
  description: 'A service to change user\'s roles',
  definitions: {
    rolesRequest: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: "posible roles: 'client:admin', 'client:manager', 'client:viewer', " +
          "'root:admin', 'root:manager', 'root:viewer'"
        }
      }
    },
    userResponse: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        _id: {
          type: 'string',
          description: 'User\'s id'
        },
        email: {
          type: 'string',
          description: 'User\'s email'
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
        client: {
          type: 'string',
          description: 'Client\'s id'
        },
        createdAt: {
          type: 'string',
          description: 'Date user was created'
        },
        status: {
          type: 'string',
          description: 'User\'s status'
        },
        roles: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'User\'s roles'
        }
      }
    }
  },
  update: {
    description: 'Rewrites user\'s roles. Accessible only for root admin.',
    parameters: [
      {
        name: '/{id}',
        description: 'User\'s id',
        in: 'request variable',
        required: true
      },
      {
        name: 'Authorization',
        description: 'Format: \'JWT access_token\'',
        in: 'headers',
        required: true
      },
      {
        name: 'Request body',
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/rolesRequest'
        }
      }
    ],
    responses: {
      200: {
        description: 'success',
        schema: {
          $ref: '#/definitions/userResponse'
        }
      },
      400: { description: 'invalid request body or no such user' },
      403: { description: 'forbidden' },
      500: { description: 'general error' }
    }
  }
};
