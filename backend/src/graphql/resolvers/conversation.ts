import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import { GraphQLContext } from '../../types/server';
import { ConversationPopulated } from './../../types/conversation';

import type { CreateConversationResponse } from '../../types/conversation';

export type ConversationCreatedSubscriptionPayload = {
  conversationCreated: ConversationPopulated
}

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

        const donkey = conversations.filter(
          (conversation) => conversation.users.some((p) => p.userId === userId))

        console.log(donkey)

        return donkey
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
    }
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
        const { conversationCreated: { users } } = payload

        const userInChat = users.some((user) => user.userId === session?.user?.id)

        console.log('users: ', users)
        console.log('session user: ', session?.user?.id)
        console.log('userInChat: ', userInChat)
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