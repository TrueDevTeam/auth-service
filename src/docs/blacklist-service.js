module.exports = {
  description: 'A service to put sessions in blacklist. ' +
  'User with blacklisted session token can not access protected resources',
  definitions: {
    blacklistRequest: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        tokenHash: {
          type: 'string',
          description: 'Access token hash. Can be retrieved from user session'
        }
      }
    },
    blacklistDeactivationResponse: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        deactivated: {
          type: 'string',
          description: 'Access token hash of deactivated session'
        }
      }
    },
    blacklistActivationResponse: {
      type: 'object',
      required: [
        'text'
      ],
      properties: {
        activated: {
          type: 'string',
          description: 'Access token hash of activated session'
        }
      }
    }
  },
  create: {
    description: 'Adds session with specified access token hash to blacklist. ' +
    'Accessible only for root admin.',
    parameters: [
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
          $ref: '#/definitions/blacklistRequest'
        }
      }
    ],
    responses: {
      201: {
        description: 'created',
        schema: {
          $ref: '#/definitions/blacklistDeactivationResponse'
        }
      },
      403: { description: 'forbidden' },
      404: { description: 'not found' },
      500: { description: 'general error' }
    }
  },
  update: {
    description: 'Removes session with specified session id from blacklist. ' +
    'Accessible only for root admin. /{id} path variable is redundant',
    parameters: [
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
          $ref: '#/definitions/blacklistRequest'
        }
      }
    ],
    responses: {
      200: {
        description: 'success',
        schema: {
          $ref: '#/definitions/blacklistActivationResponse'
        }
      },
      403: { description: 'forbidden' },
      404: { description: 'not found' },
      500: { description: 'general error' }
    }
  }
};
