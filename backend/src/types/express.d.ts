import { Request, Response } from 'express';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestParams<T> extends Request {
  params: T;
}

export interface TypedRequestQuery<T> extends Request {
  query: T;
}

export interface TypedResponse<T> extends Response {
  json: (body: T) => TypedResponse<T>;
} 