import SkeletonLoader from '@/components/common/SkeletonLoader'
import conversationOperations from '@/graphql/operations/conversation'
import {formatUsernames} from '@/utils/functions'
import {useQuery} from '@apollo/client'
import {Avatar, Badge, Button, Stack, Text} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import React from 'react'

import type {ConversationsData} from '@/graphql/types/conversation'
import {BiArrowBack} from 'react-icons/bi'
interface MessagesHeaderProps {
  userId: string
  conversationId: string
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({userId, conversationId}) => {
  const router = useRouter()
  const {data, loading} = useQuery<ConversationsData, null>(
    conversationOperations.Queries.conversations
  )

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  )

  // if (data?.conversations && !loading && !conversation) {
  //   router.replace(process.env.NEXT_PUBLIC_BASE_URL as string)
  // }

  async function handleBackCLick() {
    await router.replace('?conversationId', '/', {
      shallow: true,
    })
  }

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={5}
      px={{base: 4, md: 0}}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button className="ml-2" display={{md: 'none'}} onClick={handleBackCLick}>
        <BiArrowBack />
      </Button>
      {loading && <SkeletonLoader count={2} height="30px" width="320px" />}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack className="items-center" direction="row">
          <Text color="whiteAlpha.600">To: </Text>
          {/* <Text fontWeight={600}>{formatUsernames(conversation.users, userId)}</Text> */}
          {conversation.users.map((user) => (
            <Badge key={user.user.id} px={4} py={2} borderRadius="full">
              {user.user.username}
            </Badge>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
export default MessagesHeader
