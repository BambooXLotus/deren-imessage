import type { PrismaClient } from '@prisma/client';
import type { ISODateString } from 'next-auth';

export type GraphQLContext = {
  session: Session | null
  prisma: PrismaClient;
}

export type Session = {
  user: User
  expires: ISODateString
}

export type User = {
  id: string
  username: string
  image: string
  email: string
  name: string
}

export type CreateUsernameResponse = {
  success?: boolean
  error?: string
}