import gql from "graphql-tag"


const typeDefs = gql`
  scalar Date

  type CreateConversationResponse {
    conversationId: String
  }

  type Mutation {
    createConversation(userIds: [String]): CreateConversationResponse
  }

  type Conversation {
    id: String
    latestMessage: Message
    users: [ConversationUser]
    createdAt: Date
    updatedAt: Date
  }

  type ConversationUser {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type Query {
    conversations: [Conversation]
  }

  type Subscription {
    conversationCreated: Conversation
  }
`

export default typeDefs