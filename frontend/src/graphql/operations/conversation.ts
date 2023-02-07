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
    `
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `
  }
}

export default conversationOperations