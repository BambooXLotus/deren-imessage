import {Flex} from '@chakra-ui/react'
import {useRouter} from 'next/router'

import MessagesHeader from './Messages/Header'

import type {Session} from 'next-auth'
import MessageInput from './Messages/MessageInput'
import Messages from './Messages/Messages'

type FeedWrapperProps = {
  session: Session
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({session}) => {
  const {
    query: {conversationId},
  } = useRouter()
  const {
    user: {id: userId},
  } = session

  return (
    <Flex
      display={{base: conversationId ? 'flex' : 'none', md: 'flex'}}
      direction="column"
      width="100%"
    >
      {conversationId && typeof conversationId === 'string' ? (
        <>
          <Flex className="grow flex-col justify-between">
            <MessagesHeader conversationId={conversationId} userId={userId} />
          </Flex>
          <Messages userId={userId} conversationId={conversationId} />
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  )
}

export default FeedWrapper
