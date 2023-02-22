import { gql } from '@apollo/client';

import { MessageFields } from './message';

const ConversationFields = `
  id
  users {
    user {
      id
      username
      image
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${MessageFields}
  }
  updatedAt
  
`

const conversationOperations = {
  Queries: {
    conversations: gql`
    query Conversations {
      conversations {
        ${ConversationFields}
      }
    }
    `
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($userIds: [String]) {
        createConversation(userIds: $userIds) {
          conversationId
        }
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
    markConversationRead: gql`
      mutation MarkConversationRead($userId: String!, $conversationId: String!) {
        markConversationRead(userId: $userId, conversationId: $conversationId) 
      }
    `
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversations {
            ${ConversationFields}
          }
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `
  }
}

export default conversationOperations