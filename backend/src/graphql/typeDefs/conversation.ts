import gql from "graphql-tag"


const typeDefs = gql`
  scalar Date

  type CreateConversationResponse {
    conversationId: String
  }

  type Mutation {
    createConversation(userIds: [String]): CreateConversationResponse
  }

  type Mutation {
    markConversationRead(userId: String!, conversationId: String!): Boolean
  }

  type Mutation {
    deleteConversation(conversationId: String!): Boolean
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

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }

  type Subscription {
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }

  type Subscription {
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
`

export default typeDefs