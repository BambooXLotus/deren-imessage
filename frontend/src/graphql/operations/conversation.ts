import { gql } from '@apollo/client'

const ConversationFields = `
  id
  users {
    user {
      id
      username
    }
    
  }
  latestMessage {
    id
    sender {
      id
      username
    }
    body
    createdAt
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