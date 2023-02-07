import {formatUsernames} from '@/utils/functions'
import {Avatar, Box, Flex, Menu, MenuItem, MenuList, Stack, Text} from '@chakra-ui/react'
import {useState} from 'react'
import {AiOutlineEdit} from 'react-icons/ai'
import {BiLogOut} from 'react-icons/bi'
import {MdDeleteOutline} from 'react-icons/md'

import type {ConversationPopulated} from '../../../../../backend/src/types/conversation'
import TimeAgo from 'react-timeago'

type ConversationItemProps = {
  userId: string
  conversation: ConversationPopulated
  onClick: () => void
  isSelected: boolean
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
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
                // onDeleteConversation(conversation.id);
              }}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      {/* <Flex position="absolute" left="-6px">
        {hasSeenLatestMessage === false && (
          <GoPrimitiveDot fontSize={18} color="#6B46C1" />
        )}
      </Flex> */}
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
          {/* {getChatDate(conversation.updatedAt)} */}
          <TimeAgo date={conversation.updatedAt}></TimeAgo>
        </Text>
      </Flex>
    </Stack>
  )
}
export default ConversationItem
