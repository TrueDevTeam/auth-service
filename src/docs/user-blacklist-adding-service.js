module.exports = {
  description: 'A service to put user\'s sessions in blacklist. ' +
  'User with blacklisted session token can not access protected resources',
  update: {
    description: 'Adds all user\'s sessions to blacklist. ' +
    'Accessible only for root admin.',
    parameters: [
      {
        name: 'Authorization',
        description: 'Format: \'JWT access_token\'',
        in: 'headers',
        required: true
      },
      {
        name: '/{id}',
        in: 'request variable',
        required: true
      }
    ],
    responses: {
      200: {
        description: 'success',
        schema: {
          $ref: '#/definitions/userResponse'
        }
      },
      403: { description: 'forbidden' },
      404: { description: 'not found' },
      500: { description: 'general error' }
    }
  }
};
