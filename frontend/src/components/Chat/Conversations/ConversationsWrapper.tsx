import ConversationOperations from '@/graphql/operations/conversation'
import {useQuery} from '@apollo/client'
import {Box} from '@chakra-ui/react'

import ConversationList from './ConversationList'

import type {Session} from 'next-auth'
import type {ConversationsData} from '@/graphql/types/conversation'

import type {ConversationPopulated} from '../../../../../backend/src/types/conversation'
import {useEffect} from 'react'
import {useRouter} from 'next/router'

type ConverationsWrapperProps = {
  session: Session
}

const ConverationsWrapper: React.FC<ConverationsWrapperProps> = ({session}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)
  const {
    push,
    query: {conversationId},
  } = useRouter()

  async function handleViewConversation(conversationId: string) {
    await push({
      query: {conversationId},
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

  useEffect(() => {
    subscribeToNewConversations()
  })

  return (
    <Box
      className="w-full py-6 px-3 md:w-96"
      bg="whiteAlpha.50"
      display={{base: conversationId ? 'none' : 'flex', md: 'flex'}}
    >
      {/* Skeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={handleViewConversation}
      />
    </Box>
  )
}

export default ConverationsWrapper
