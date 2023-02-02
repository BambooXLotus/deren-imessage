import { User } from './user';

import type { PrismaClient } from '@prisma/client';
import type { ISODateString } from 'next-auth';

import type { Context } from 'graphql-ws/lib/server'
import type { PubSub } from 'graphql-subscriptions';

export type GraphQLContext = {
  session: Session | null
  prisma: PrismaClient;
  pubsub: PubSub
}

export type Session = {
  user: User
  expires: ISODateString
}

export type SubscriptionContext = {
  connectionParams: {
    session?: Session
  }
} & Context