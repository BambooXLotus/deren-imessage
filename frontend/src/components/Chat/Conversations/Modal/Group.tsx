import type {SearchedUser} from '@/graphql/types/user'
import {Flex, Stack, Text} from '@chakra-ui/react'
import {IoIosCloseCircleOutline} from 'react-icons/io'

type GroupProps = {
  people: SearchedUser[]
  removePeople: (userId: string) => void
}

const Group: React.FC<GroupProps> = ({people, removePeople}) => {
  return (
    <Flex className="mt-8 flex-wrap gap-2.5">
      {people.map((person) => (
        <Stack
          key={person.id}
          className="rounded-md p-2"
          direction="row"
          align="center"
          bg="whiteAlpha.200"
        >
          <Text>{person.username}</Text>
          <IoIosCloseCircleOutline
            className="h-5 w-5 cursor-pointer"
            onClick={() => removePeople(person.id)}
          />
        </Stack>
      ))}
    </Flex>
  )
}

export default Group
