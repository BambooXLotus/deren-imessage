import type {SearchedUser} from '@/graphql/types/user'
import {Avatar, Button, Flex, Stack, Text} from '@chakra-ui/react'

type UserSearchListProps = {
  users: SearchedUser[]
  addPeople: (user: SearchedUser) => void
}

const UserSearchList: React.FC<UserSearchListProps> = ({users, addPeople}) => {
  return (
    <>
      {users.length === 0 && (
        <Flex className="mt-6 justify-center">
          <Text>No users found</Text>
        </Flex>
      )}

      {users.map((user) => (
        <Stack
          className="mt-6 rounded-md py-2 px-4"
          key={user.id}
          direction="row"
          align="center"
          spacing={4}
          _hover={{bg: 'whiteAlpha.200'}}
        >
          <Avatar src={user.image} />
          <Flex width="100%" justify="space-between" align="center">
            <Text>{user.username}</Text>
            <Button bg="brand.100" _hover={{bg: 'brand.100'}} onClick={() => addPeople(user)}>
              Select
            </Button>
          </Flex>
        </Stack>
      ))}
    </>
  )
}

export default UserSearchList
