import { Request } from 'express';

interface AuthUser {
  sub: string;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}
