import {Avatar, Box, Flex, Stack, Text} from '@chakra-ui/react'

import type {MessagePopulated} from '../../../../../../backend/src/types/message'

import TimeAgo from 'react-timeago'

type MessageItemProps = {
  message: MessagePopulated
  sentByMe: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({message, sentByMe}) => {
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      _hover={{bg: 'whiteAlpha.200'}}
      justify={sentByMe ? 'flex-end' : 'flex-start'}
      wordBreak="break-word"
    >
      {!sentByMe && (
        <Flex>
          <Avatar src={message.sender.image as string} size="lg" />
        </Flex>
      )}

      <Stack className="w-full" spacing={1}>
        <Stack direction="row" align="center" justify={sentByMe ? 'flex-end' : 'flex-start'}>
          {!sentByMe && <Text className="text-left font-bold">{message.sender.username}</Text>}
          <Text className="text-xs">
            <TimeAgo date={message.createdAt}></TimeAgo>
          </Text>
        </Stack>
        <Flex justify={sentByMe ? 'flex-end' : 'flex-start'}>
          <Box
            className="max-w-full rounded-xl px-5 py-2 md:max-w-xl"
            bg={sentByMe ? 'brand.100' : 'whiteAlpha.300'}
          >
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>

      {sentByMe && (
        <Flex>
          <Avatar src={message.sender.image as string} size={{base: 'xs', md: 'lg'}} />
        </Flex>
      )}
    </Stack>
  )
}

export default MessageItem
