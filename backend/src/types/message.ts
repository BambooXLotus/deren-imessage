
import { Prisma } from '@prisma/client';
import type { messagePopulated } from './../graphql/resolvers/message';

export type SendMessageArguments = {
  id: string
  conversationId: string
  senderId: string
  body: string
}

export type MessageSentSubscriptionPayload = {
  messageSent: MessagePopulated
}

export type MessagePopulated = Prisma.MessageGetPayload<{ include: typeof messagePopulated }>