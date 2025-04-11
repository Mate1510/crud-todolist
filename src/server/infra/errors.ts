export class HttpNotFound extends Error {
  status: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.status = 404;
  }
}
