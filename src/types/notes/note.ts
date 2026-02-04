import { Request } from 'express';

interface AuthUser {
  userId: string;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}
