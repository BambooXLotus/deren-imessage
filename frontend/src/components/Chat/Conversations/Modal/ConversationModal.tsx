import conversationOperations from '@/graphql/operations/conversation'
import UserOperations from '@/graphql/operations/user'
import {getErrorMessage} from '@/utils/ErrorHelper'
import {useLazyQuery, useMutation} from '@apollo/client'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {toast} from 'react-hot-toast'

import Group from './Group'
import UserSearchList from './UserSearchList'

import type {SearchedUser, SearchUsersData, SearchUsersInput} from '@/graphql/types/user'
import type {CreateConversationData, CreateConversationInput} from '@/graphql/types/conversation'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ConversationModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
  const [username, setUsername] = useState('')
  const [people, setPeople] = useState<SearchedUser[]>([])

  const {data: sessionData} = useSession()
  const router = useRouter()

  const [searchUsers, {data, loading: searchUsersLoading}] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers)

  const [createConversation, {loading: createConversationLoading}] = useMutation<
    CreateConversationData,
    CreateConversationInput
  >(conversationOperations.Mutations.createConversation)

  function addPeople(user: SearchedUser) {
    setPeople((prev) => [...prev, user])
  }

  function removePeople(userId: string) {
    setPeople((prev) => prev.filter((person) => person.id !== userId))
  }

  async function handleSearchUsers(event: React.FormEvent) {
    event.preventDefault()
    await searchUsers({variables: {username}})
  }

  async function handleCreateConversation() {
    try {
      const userId = sessionData?.user.id as string
      const addedUserIds = people.map((person) => person.id)
      const userIds = [userId, ...addedUserIds]

      console.log(userIds)

      const {data} = await createConversation({
        variables: {
          userIds,
        },
      })

      if (!data?.createConversation) {
        throw new Error('Failed to create conversation')
      }

      const {
        createConversation: {conversationId},
      } = data

      await router.push({query: {conversationId}})

      setPeople([])
      setUsername('')
      onClose()
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      reportError(message)

      toast.error(message)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="pb-4" bg="whiteAlpha.100">
          <ModalHeader>Create a Convo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSearchUsers}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                {/* DISABLED NOT WORKING */}
                <Button type="submit" disabled={true} isLoading={searchUsersLoading}>
                  Search
                </Button>
              </Stack>
            </form>
            <>
              {data?.searchUsers && (
                <UserSearchList users={data?.searchUsers} addPeople={addPeople} />
              )}
              {people.length !== 0 && (
                <>
                  <Group people={people} removePeople={removePeople} />
                  <Button
                    className="bg mt-6 w-full"
                    bg="brand.100"
                    _hover={{bg: 'brand.100'}}
                    isLoading={createConversationLoading}
                    onClick={handleCreateConversation}
                  >
                    Create Chat
                  </Button>
                </>
              )}
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal
