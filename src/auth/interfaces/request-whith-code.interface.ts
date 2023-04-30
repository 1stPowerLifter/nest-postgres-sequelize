import { Request } from 'express';

export interface IRequestWithCode extends Request {
  query: {
    code: string;
  };
}
