import {Flex} from '@chakra-ui/react'

import ConverationsWrapper from './Conversations/ConversationsWrapper'
import FeedWrapper from './Feed/FeedWrapper'

import type {Session} from 'next-auth'

type ChatProps = {
  session: Session
}

const Chat: React.FC<ChatProps> = ({session}) => {
  return (
    <Flex height="100vh">
      <ConverationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  )
}

export default Chat
