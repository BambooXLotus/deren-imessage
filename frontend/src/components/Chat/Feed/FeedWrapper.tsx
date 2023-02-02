import {Flex} from '@chakra-ui/react'
import {useRouter} from 'next/router'

import MessagesHeader from './Messages/Header'

import type {Session} from 'next-auth'

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
        <Flex className="grow-1 flex-col justify-between overflow-hidden">
          <MessagesHeader conversationId={conversationId} userId={userId} />
        </Flex>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  )
}

export default FeedWrapper
