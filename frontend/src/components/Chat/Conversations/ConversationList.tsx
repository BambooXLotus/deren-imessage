import {Avatar, Box, Stack, Text} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useState} from 'react'

import ConversationItem from './ConversationItem'
import ConversationModal from './Modal/ConversationModal'

import type {ConversationPopulated} from '../../../../../backend/src/types/conversation'
import type {Session} from 'next-auth'

type ConversationListProps = {
  session: Session
  conversations: ConversationPopulated[]
  onViewConversation: (conversationId: string) => void
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const {user} = session

  function onOpen() {
    setIsOpen(true)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleClickConversation(conversationId: string) {
    onViewConversation(conversationId)
  }

  return (
    <Box className="w-full">
      <Stack
        className="mb-4 items-center space-x-2 rounded-md p-4 "
        bg="whiteAlpha.200"
        direction="row"
      >
        <Avatar src={user.image} />
        <Text fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {user.username}
        </Text>
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
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            userId={user.id}
            conversation={conversation}
            onClick={() => handleClickConversation(conversation.id)}
            isSelected={conversation.id === router.query.conversationId}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default ConversationList
