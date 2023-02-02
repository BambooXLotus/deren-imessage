import type { ConversationPopulated } from '../../../../backend/src/types/conversation'

export type CreateConversationInput = {
  userIds: string[]
}

export type CreateConversationData = {
  createConversation: {
    conversationId: string
  }
}

export type ConversationsData = {
  conversations: ConversationPopulated[]
}