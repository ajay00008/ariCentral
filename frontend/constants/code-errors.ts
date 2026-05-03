export const Codes = {
  ALREADY_EXISTS: {
    code: 1,
    message: 'Value already exists'
  },
  INCORRECT: {
    code: 400,
    message: 'Some field values are incorrect. Please, check them and try to write it again.'
  },
  NOT_FOUND: {
    code: 3,
    message: 'User with this id was not found'
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error'
  }
}
