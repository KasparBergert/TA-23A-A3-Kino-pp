//Purpose: Send error messages in a structured way.
export default class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}
