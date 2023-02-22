import {Avatar, Box, Button, Stack, Text} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useState} from 'react'

import ConversationItem from './ConversationItem'
import ConversationModal from './Modal/ConversationModal'

import type {ConversationPopulated} from '../../../../../backend/src/types/conversation'
import type {Session} from 'next-auth'
import {useMutation} from '@apollo/client'
import conversationOperations from '@/graphql/operations/conversation'
import {toast} from 'react-hot-toast'
import {AiOutlineLogout} from 'react-icons/ai'
import {signOut} from 'next-auth/react'

type ConversationListProps = {
  session: Session
  conversations: ConversationPopulated[]
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const {user} = session
  const [deleteConversation] = useMutation<{deleteConversation: boolean; conversationId: string}>(
    conversationOperations.Mutations.deleteConversation
  )

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  )

  function onOpen() {
    setIsOpen(true)
  }

  function onClose() {
    setIsOpen(false)
  }

  async function handleDeleteConversation(conversationId: string) {
    await toast.promise(
      deleteConversation({
        variables: {
          conversationId,
        },
        update: () => {
          const baseUrl =
            typeof process.env.NEXT_PUBLIC_BASE_URL === 'string'
              ? process.env.NEXT_PUBLIC_BASE_URL
              : ''
          router.replace(baseUrl).catch(() => console.log('bonk'))
        },
      }),
      {
        loading: 'Deleting Chat',
        success: 'Deleted Chat',
        error: 'Failed to Delete Chat',
      }
    )
  }

  function handleClickConversation(conversationId: string, hasSeenLatestMessage: boolean) {
    onViewConversation(conversationId, hasSeenLatestMessage)
  }

  return (
    <Box className="w-full">
      <Stack
        className="mb-4 items-center justify-between rounded-md p-4 "
        bg="whiteAlpha.200"
        direction="row"
      >
        <div className="flex flex-row items-center space-x-2">
          <Avatar src={user.image} />
          <Text fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {user.username}
          </Text>
        </div>
        <Button onClick={() => signOut()}>
          <AiOutlineLogout />
        </Button>
      </Stack>
      <Box
        className="mb-4 cursor-pointer rounded-md py-2 px-4"
        bg="blackAlpha.300"
        _hover={{bg: 'whiteAlpha.300'}}
      >
        <Text className="text-center font-bold" color="whiteAlpha.800" onClick={onOpen}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} />

      <Stack>
        {sortedConversations.map((conversation) => {
          const currentUser = conversation.users.find((chatUser) => chatUser.user.id === user.id)
          const hasSeen = currentUser ? currentUser.hasSeenLatestMessage : false

          return (
            <ConversationItem
              key={conversation.id}
              userId={user.id}
              conversation={conversation}
              onClick={() => handleClickConversation(conversation.id, hasSeen)}
              isSelected={conversation.id === router.query.conversationId}
              hasSeenLatestMessage={hasSeen}
              onDeleteConversation={() => handleDeleteConversation}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default ConversationList
