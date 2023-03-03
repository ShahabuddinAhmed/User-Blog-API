export class AppSerializer {
  statusCode: number;
  code: string;
  message: string;
  data: any;
  errors: any;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    data: any,
    errors: any,
  ) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
