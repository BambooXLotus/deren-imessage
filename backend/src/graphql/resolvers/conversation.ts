import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import { GraphQLContext } from '../../types/server';
import {
  ConversationCreatedSubscriptionPayload,
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
} from './../../types/conversation';

import type { CreateConversationResponse } from '../../types/conversation';

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<ConversationPopulated[]> => {
      const { session, prisma } = context

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const { id: userId } = session.user

      try {
        const conversations = await prisma.conversation.findMany({
          // where: {
          //   users: {
          //     some: {
          //       userId: {
          //         equals: userId
          //       }
          //     }
          //   }
          // },
          include: conversationPopulated
        })

        return conversations.filter(
          (conversation) => conversation.users.some((p) => p.userId === userId))

      } catch (error: any) {
        throw new GraphQLError(error?.message)
      }
    }
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { userIds: string[] },
      context: GraphQLContext
    ): Promise<CreateConversationResponse> => {
      const { userIds } = args;
      const { session, prisma, pubsub } = context

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const { id: userId } = session.user

      try {
        const conversation = await prisma.conversation.create({
          data: {
            users: {
              createMany: {
                data: userIds.map(conversationUserId => ({
                  userId: conversationUserId,
                  hasSeenLatestMessage: conversationUserId === userId
                }))
              }
            }
          },
          include: conversationPopulated
        })

        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation
        })

        return {
          conversationId: conversation.id
        };

      } catch (error: any) {
        console.log(error)
        throw new GraphQLError(error?.message)
      }
    },
    markConversationRead: async (
      _: any,
      args: { userId: string, conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { userId, conversationId } = args;
      const { session, prisma, pubsub } = context

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const chatUser = await prisma.conversationUser.findFirst({
        where: {
          userId,
          conversationId
        }
      })

      if (!chatUser) {
        throw new GraphQLError('Chat User not found')
      }

      await prisma.conversationUser.update({
        where: {
          id: chatUser.id,
        },
        data: {
          hasSeenLatestMessage: true
        }
      })

      return true
    },
    deleteConversation: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { conversationId } = args;
      const { session, prisma, pubsub } = context

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const deleteConversation = prisma.conversation.delete({
        where: {
          id: conversationId
        },
        include: conversationPopulated
      })

      const deleteConversationUser = prisma.conversationUser.deleteMany({
        where: {
          conversationId
        }
      })

      const deleteMessages = prisma.message.deleteMany({
        where: {
          conversationId
        }
      })

      const [deletedConversation] = await prisma.$transaction([deleteConversation, deleteConversationUser, deleteMessages])

      pubsub.publish("CONVERSATION_DELETED", {
        conversationDeleted: deletedConversation
      })

      return true
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter((
        _: any,
        __: any,
        context: GraphQLContext
      ) => {
        const { pubsub } = context

        return pubsub.asyncIterator(['CONVERSATION_CREATED'])
      }, (
        payload: ConversationCreatedSubscriptionPayload,
        _: any,
        context: GraphQLContext
      ) => {

        const { session } = context
        const { conversationCreated: { users: chatUsers } } = payload

        //USE utility function or just get rid of it because its a one liner
        const userInChat = chatUsers.some((chatUser) => chatUser.user.id === session?.user?.id)
        return userInChat
      })
    },
    conversationUpdated: {
      subscribe: withFilter((
        _: any,
        __: any,
        context: GraphQLContext
      ) => {
        const { pubsub } = context
        return pubsub.asyncIterator(['CONVERSATION_UPDATED'])
      }, (
        payload: ConversationUpdatedSubscriptionPayload,
        _: any,
        context: GraphQLContext
      ) => {

        const { session } = context

        if (!session?.user) {
          throw new GraphQLError('Not Authorized')
        }

        const { conversationUpdated: { conversation: { users: chatUsers } } } = payload

        const userInChat = chatUsers.some((user) => user.userId === session?.user?.id)
        return userInChat
      })
    },
    conversationDeleted: {
      subscribe: withFilter((
        _: any,
        __: any,
        context: GraphQLContext
      ) => {
        const { pubsub } = context
        return pubsub.asyncIterator(['CONVERSATION_DELETED'])
      }, (
        payload: ConversationDeletedSubscriptionPayload,
        _: any,
        context: GraphQLContext
      ) => {
        const { session } = context

        if (!session?.user) {
          throw new GraphQLError('Not Authorized')
        }

        const { id: userId } = session.user

        const { conversationDeleted: { users: chatUsers } } = payload

        const userInChat = chatUsers.some((user) => user.userId === userId)
        return userInChat
      })
    },
  }
}

export const conversationUsersPopulated = Prisma.validator<Prisma.ConversationUserInclude>()({
  user: {
    select: {
      id: true,
      username: true,
      image: true
    }
  }
})

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
  users: {
    include: conversationUsersPopulated
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true
        }
      }
    }
  }
})

export default resolvers