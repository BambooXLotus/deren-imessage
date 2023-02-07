import MessageOperations from '@/graphql/operations/message'
import {generateObjectId} from '@/utils/functions'
import {useMutation} from '@apollo/client'
import {Box, Input} from '@chakra-ui/react'
import {useState} from 'react'
import {toast} from 'react-hot-toast'

import type {Session} from 'next-auth'
import type {MessagesData, SendMessageData, SendMessageVariables} from '@/graphql/types/message'

type MessageInputProps = {
  session: Session
  conversationId: string
}

const MessageInput: React.FC<MessageInputProps> = ({session, conversationId}) => {
  const [messageBody, setMessageBody] = useState('')
  const [sendMessage] = useMutation<SendMessageData, SendMessageVariables>(
    MessageOperations.Mutations.sendMessage
  )

  async function handleSubmitMessage(event: React.FormEvent) {
    event.preventDefault()

    const {id: senderId} = session.user
    const messageId = generateObjectId()
    const messageVariables: SendMessageVariables = {
      id: messageId,
      senderId,
      conversationId,
      body: messageBody,
    }

    await sendMessage({
      variables: messageVariables,
      onCompleted: () => {
        setMessageBody('')
      },
      optimisticResponse: {
        sendMessage: true,
      },
      update: (cache) => {
        const existing = cache.readQuery<MessagesData>({
          query: MessageOperations.Queries.messages,
          variables: {conversationId},
        }) as MessagesData

        cache.writeQuery<MessagesData, {conversationId: string}>({
          query: MessageOperations.Queries.messages,
          variables: {conversationId},
          data: {
            ...existing,
            messages: [
              {
                id: messageId,
                body: messageBody,
                senderId: session.user.id,
                conversationId,
                sender: {
                  id: session.user.id,
                  username: session.user.username,
                  image: session.user.image,
                },
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
              },
              ...existing.messages,
            ],
          },
        })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Box className="w-full px-4 py-4">
      <form onSubmit={handleSubmitMessage}>
        <Input
          className="focus:shadow-none"
          resize="none"
          placeholder="Text Message"
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
        />
      </form>
    </Box>
  )
}

export default MessageInput
