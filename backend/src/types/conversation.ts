import type { conversationUsersPopulated } from './../graphql/resolvers/conversation';
import { Prisma } from '@prisma/client';

import type { conversationPopulated } from '../graphql/resolvers/conversation';

export type CreateConversationResponse = {
  conversationId: string
}

export type ConversationCreatedSubscriptionPayload = {
  conversationCreated: ConversationPopulated
}

export type ConversationUpdatedSubscriptionPayload = {
  conversationUpdated: {
    conversation: ConversationPopulated
  }
}

export type ConversationDeletedSubscriptionPayload = {
  conversationDeleted: ConversationPopulated
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated }>
export type ConversationUserPopulated = Prisma.ConversationUserGetPayload<{ include: typeof conversationUsersPopulated }>