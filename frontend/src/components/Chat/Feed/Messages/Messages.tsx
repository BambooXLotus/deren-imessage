import SkeletonLoader from '@/components/common/SkeletonLoader'
import MessageOperations from '@/graphql/operations/message'
import {useQuery} from '@apollo/client'
import {Flex, Stack} from '@chakra-ui/react'
import {useEffect} from 'react'
import {toast} from 'react-hot-toast'

import MessageItem from './MessageItem'

import type {
  MessagesData,
  MessageSubscriptionData,
  MessagesVariables,
} from '@/graphql/types/message'
type MessagesProps = {
  userId: string
  conversationId: string
}

const Messages: React.FC<MessagesProps> = ({userId, conversationId}) => {
  const {data, loading, error, subscribeToMore} = useQuery<MessagesData, MessagesVariables>(
    MessageOperations.Queries.messages,
    {
      variables: {
        conversationId,
      },
      onError: ({message}) => {
        toast.error(message)
      },
    }
  )

  function subscribeToMoreMessages(conversationId: string) {
    subscribeToMore({
      document: MessageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, {subscriptionData}: MessageSubscriptionData) => {
        if (!subscriptionData) return prev

        const newMessage = subscriptionData.data.messageSent

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId ? prev.messages : [newMessage, ...prev.messages],
        })
      },
    })
  }

  useEffect(() => {
    subscribeToMoreMessages(conversationId)

    // return () => unsubscribe()
  }, [conversationId])

  if (error) {
    return <div>ERROR</div>
  }

  return (
    <Flex className="flex-col justify-end overflow-hidden">
      {loading && (
        <Stack className="space-4 px-4">
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex className="h-full flex-col-reverse overflow-y-scroll">
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  )
}

export default Messages
