import { conversationPopulated } from './conversation';
import { MessageSentSubscriptionPayload, MessagePopulated } from './../../types/message';
import { withFilter } from 'graphql-subscriptions';
import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { SendMessageArguments } from '../../types/message';
import { GraphQLContext } from '../../types/server';
import { userInChat } from '../util/functions';

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<MessagePopulated[]> => {
      const { session, prisma } = context
      const { conversationId } = args

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const { user: { id: userId } } = session

      try {
        const conversation = await prisma.conversation.findUnique({
          where: {
            id: conversationId
          },
          include: conversationPopulated
        })

        if (!conversation) {
          throw new GraphQLError("Chat Not Found")
        }

        const allowedToView = userInChat(conversation.users, userId)

        if (!allowedToView) {
          throw new GraphQLError("Not Authorized")
        }

        const messages = await prisma.message.findMany({
          where: {
            conversationId
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc'
          }
        })

        return messages;
      } catch (error: any) {
        console.log('sendMessage: ', error)

        throw new GraphQLError(error?.message)
      }

      return []
    }
  },
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArguments,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const { user: { id: userId } } = session
      const { id: messageId, senderId, conversationId, body } = args

      if (userId !== senderId) {
        throw new GraphQLError('Not Authorized')
      }

      try {
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body
          },
          include: messagePopulated
        })

        const chatUser = await prisma.conversationUser.findFirst({
          where: {
            userId,
            conversationId
          }
        })

        if (!chatUser) {
          throw new GraphQLError('Chat User does not exist')
        }

        console.log("Conversation Update: ", args, senderId)

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            users: {
              update: {
                where: {
                  id: chatUser.id
                },
                data: {
                  hasSeenLatestMessage: true
                }
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: userId
                  }
                },
                data: {
                  hasSeenLatestMessage: false
                }
              }
            }
          },
          include: conversationPopulated
        })

        pubsub.publish("MESSAGE_SENT", { messageSent: newMessage })
        // pubsub.publish("CONVERSATION_UPDATED", { conversationUpdated: { conversation } })

      } catch (error: any) {
        console.log('sendMessage: ', error)

        throw new GraphQLError(error?.message)
      }

      return true
    }
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter((
        _: any,
        __: any,
        context: GraphQLContext
      ) => {
        const { pubsub } = context

        return pubsub.asyncIterator(['MESSAGE_SENT'])
      }, (
        payload: MessageSentSubscriptionPayload,
        args: { conversationId: string },
        context: GraphQLContext
      ) => {
        const { conversationId } = args

        return payload.messageSent.conversationId === conversationId
      })
    }
  }
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
      image: true
    }
  }
})

export default resolvers;