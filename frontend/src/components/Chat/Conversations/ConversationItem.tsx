import {formatUsernames} from '@/utils/functions'
import {Avatar, Box, Flex, Menu, MenuItem, MenuList, Stack, Text} from '@chakra-ui/react'
import {useState} from 'react'
import {AiOutlineEdit} from 'react-icons/ai'
import {BiLogOut} from 'react-icons/bi'
import {GoPrimitiveDot} from 'react-icons/go'
import {MdDeleteOutline} from 'react-icons/md'
import TimeAgo from 'react-timeago'

import type {ConversationPopulated} from '../../../../../backend/src/types/conversation'
type ConversationItemProps = {
  userId: string
  conversation: ConversationPopulated
  onClick: () => void
  isSelected: boolean
  hasSeenLatestMessage: boolean
  onDeleteConversation: (conversationId: string) => void
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
  hasSeenLatestMessage,
  onDeleteConversation,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleClick(event: React.MouseEvent) {
    if (event.type === 'click') {
      onClick()
    } else if (event.type === 'contextmenu') {
      event.preventDefault()
      setMenuOpen(true)
    }
  }

  function handleDeleteClick(conversationId: string) {
    onDeleteConversation(conversationId)
  }

  return (
    <Stack
      className="w-full rounded-md"
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      cursor="pointer"
      bg={isSelected ? 'whiteAlpha.200' : 'none'}
      _hover={{bg: 'whiteAlpha.200'}}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
    >
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="#2d2d2d">
          <MenuItem
            icon={<AiOutlineEdit fontSize={20} />}
            onClick={(event) => {
              event.stopPropagation()
              //   onEditConversation();
            }}
          >
            Edit
          </MenuItem>
          {conversation.users.length > 2 ? (
            <MenuItem
              icon={<BiLogOut fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation()
                // onLeaveConversation(conversation);
              }}
            >
              Leave
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdDeleteOutline fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation()
                handleDeleteClick(conversation.id)
              }}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <Flex position="absolute" left="-6px">
        {hasSeenLatestMessage === false && (
          <>
            <GoPrimitiveDot
              className="absolute animate-ping fill-purple-600 text-lg"
              fontSize={18}
            />
            <GoPrimitiveDot className="relative fill-purple-600 text-lg" fontSize={18} />
          </>
        )}
      </Flex>
      {conversation.latestMessage ? (
        <Avatar src={conversation.latestMessage.sender.image as string} />
      ) : (
        <Avatar
          src={conversation.users.filter((user) => user.id === userId)[0]?.user.image as string}
        />
      )}
      <Flex className="flex-col" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text fontWeight={600} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {formatUsernames(conversation.users, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box width="140%">
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text className="text-xs" color="whiteAlpha.700">
          <TimeAgo date={conversation.updatedAt}></TimeAgo>
        </Text>
      </Flex>
    </Stack>
  )
}
export default ConversationItem
