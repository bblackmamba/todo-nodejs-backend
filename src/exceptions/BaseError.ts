import { HttpStatusCode } from "../enums/HttpStatusCode";

export class BaseError {
  public readonly httpCode: HttpStatusCode;
  public readonly message: {
    status: string,
    name: string,
    description: string,
  };
  public readonly isOperational: boolean;

  constructor({
    httpCode,
    name, 
    description,
    isOperational = true,
  }: {
    httpCode: HttpStatusCode;
    name: string;
    description: string;
    isOperational?: boolean;
  }) {
    this.httpCode = httpCode;
    this.message = {
      status: 'eror',
      name: name,
      description: description,
    }
    this.isOperational = isOperational;
  }
}
