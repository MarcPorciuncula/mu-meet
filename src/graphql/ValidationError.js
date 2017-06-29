export default class ValidationError extends Error {
  errors: Array<Error>;
  message: string;

  constructor(errors) {
    super();
    this.errors = errors;
    this.message = 'GraphQL query has validation errors';
  }
}
