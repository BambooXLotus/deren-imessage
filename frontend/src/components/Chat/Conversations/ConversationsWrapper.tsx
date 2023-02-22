import SkeletonLoader from '@/components/common/SkeletonLoader'
import ConversationOperations from '@/graphql/operations/conversation'
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client'
import {Box} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import ConversationList from './ConversationList'

import type {Session} from 'next-auth'
import type {
  ConversationDeletedData,
  ConversationsData,
  ConversationUpdatedData,
} from '@/graphql/types/conversation'

import type {
  ConversationPopulated,
  ConversationUserPopulated,
} from '../../../../../backend/src/types/conversation'
type ConverationsWrapperProps = {
  session: Session
}

const ConverationsWrapper: React.FC<ConverationsWrapperProps> = ({session}) => {
  const {
    push,
    query: {conversationId},
  } = useRouter()

  const {
    user: {id: userId},
  } = session
  const {
    data: conversationsData,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)

  const [markConversationRead] = useMutation<
    {markConversationRead: boolean},
    {userId: string; conversationId: string}
  >(ConversationOperations.Mutations.markConversationRead)

  useSubscription<ConversationUpdatedData, null>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: async ({client, data}) => {
        const {data: subscriptionData} = data

        if (!subscriptionData) return

        const {
          conversationUpdated: {conversation: updatedConversation},
        } = subscriptionData

        const currentConversation = updatedConversation.id === conversationId

        if (currentConversation) {
          await handleViewConversation(conversationId, false)
        }
      },
    }
  )

  useSubscription<ConversationDeletedData, null>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: async ({client, data}) => {
        const {data: subscriptionData} = data

        if (!subscriptionData) return

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
        })

        if (!existing) return

        const {conversations} = existing
        const {
          conversationDeleted: {id: deletedConversationId},
        } = subscriptionData

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        })
      },
    }
  )

  async function handleViewConversation(conversationId: string, hasSeenLatestMessage: boolean) {
    await push({
      query: {conversationId},
    })

    if (hasSeenLatestMessage) return

    await markConversationRead({
      variables: {
        userId,
        conversationId,
      },
      optimisticResponse: {
        markConversationRead: true,
      },
      update: (cache) => {
        const chatUsersFragment = cache.readFragment<{chatUsers: ConversationUserPopulated[]}>({
          id: `Conversation:${conversationId}`,
          fragment: gql`
            fragment ChatUsers on Conversation {
              conversationUsers {
                user {
                  id
                  username
                }
                hasSeenLatestMessage
              }
            }
          `,
        })

        //TODO: NOT WORKING
        console.log('chatUsersFragment:::::::::', chatUsersFragment)

        if (!chatUsersFragment) return

        const chatUsers = [...chatUsersFragment.chatUsers]
        const chatUserIdx = chatUsers.findIndex((chatUser) => chatUser.user.id === userId)

        if (chatUserIdx === -1) return

        const chatUser = chatUsers[chatUserIdx]

        chatUsers[chatUserIdx] = {
          ...chatUser,
          hasSeenLatestMessage: true,
        }

        cache.writeFragment({
          id: `Conversation:${conversationId}`,
          fragment: gql`
            fragment UpdateChatUser on Conversation {
              conversationUser
            }
          `,
          data: {
            chatUsers,
          },
        })
      },
    })
  }

  function subscribeToNewConversations() {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: {conversationCreated: ConversationPopulated}
          }
        }
      ) => {
        if (!subscriptionData.data) return prev

        console.log('SUB DATA: ', subscriptionData.data)

        const newConversation = subscriptionData.data.conversationCreated

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        })
      },
    })
  }

  // function subscribeTo

  useEffect(() => {
    subscribeToNewConversations()
  }, [])

  return (
    <Box
      className="w-full gap-4 py-6 px-3 md:w-96"
      flexDirection="column"
      bg="whiteAlpha.50"
      display={{base: conversationId ? 'none' : 'flex', md: 'flex'}}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={4} height="80px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={() => handleViewConversation}
        />
      )}
    </Box>
  )
}

export default ConverationsWrapper
