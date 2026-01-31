export enum authMessages {
  INVALID_CREDENTIALS = 'Invalid credentials',
  USER_NOT_FOUND = 'User not found',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  WEAK_PASSWORD = 'Password does not meet security requirements',
}
export enum secretMessages {
  JWT_SECRET = 'JWT_SECRET',
  JWT_SECRET_MISSING = 'JWT secret is missing',
  ADMIN_SECRET_KEY = 'ADMIN_SECRET_KEY',
  ADMIN_SECRET_KEY_MISSING = 'Admin secret key is missing',
  ADMIN_SECRET_KEY_MISMATCH = 'Admin secret key does not match',
  INVALID_SECRET_KEY = 'Invalid secret key provided',
  SECRET_KEY_REQUIRED = 'Secret key is required for this operation',
}
