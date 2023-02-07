import type { MessagePopulated } from '../../../../backend/src/types/message'

export type MessagesData = {
  messages: MessagePopulated[]
}

export type MessagesVariables = {
  conversationId: string
}

export type SendMessageData = {
  sendMessage: boolean
}

export type SendMessageVariables = {
  id: string
  conversationId: string
  senderId: string
  body: string
}

export type MessageSubscriptionData = {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated
    }
  }
}