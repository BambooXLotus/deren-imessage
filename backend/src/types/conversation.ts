import { conversationUsersPopulated } from './../graphql/resolvers/conversation';
import { Prisma } from '@prisma/client';

import type { conversationPopulated } from '../graphql/resolvers/conversation';

export type CreateConversationResponse = {
  conversationId: string
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated }>
export type ConversationUserPopulated = Prisma.ConversationUserGetPayload<{ include: typeof conversationUsersPopulated }>