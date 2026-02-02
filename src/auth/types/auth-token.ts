import { Role } from '../roles.enum';

export type AuthTokenResponse = {
  access_token: string;
  user: { id: object; email: string; name: string; role: Role };
};
