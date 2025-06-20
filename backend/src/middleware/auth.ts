import jwt,{ verify } from 'jsonwebtoken'
import express, { Request, Response, NextFunction, RequestHandler } from 'express'

// alter user type
// currently the middleware is somewhere else, this code is techincally currently 
// useless.
interface User {
  id: number;
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  createdAt?: Date;
  updatedAt?: Date;
}
interface AuthenticatedRequest extends Request {
  user?: User;
}

export default function ensureAutheticated(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token jwt não informado')
  }
  const [, token] = authHeader.split(" ");
  const jwt_secret = process.env.JWT_SECRET
  if (!jwt_secret) return;
  // jwt secret has to be here
  try {
    const { sub: user_id } = verify(token, jwt_secret)

    request.user = {
      id: Number(user_id)
    }
    return next()
  } catch {
    throw new AppError('JWT token inválido')
  }

}

class AppError {
  message
  statusCode

  constructor(message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}


export function generateToken(user: any) {
  const token = process.env.JWT_SECRET
  if(!token) return
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    token,
    { expiresIn: '1h' }
  );
}