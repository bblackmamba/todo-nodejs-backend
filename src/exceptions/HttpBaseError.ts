import { Response } from "express";
import { BaseError } from "./BaseError";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export function HttpBaseError({response, err}: {response: Response, err: BaseError | Error}): void {
  if (err instanceof BaseError) {
    response.status(err.httpCode).json(err.message).end();
  }
  else {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      description: 'internal server error',
      developerMessage: err.message,
    }).end();
  }
}