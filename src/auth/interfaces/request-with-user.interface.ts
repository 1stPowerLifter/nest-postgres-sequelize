import { Request } from 'express';
import { User } from 'src/users/user.model';

export interface IRequestWithUser extends Request {
  user: User;
}
