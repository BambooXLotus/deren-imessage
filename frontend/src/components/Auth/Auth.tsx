import UserOperations from '@/graphql/operations/user'
import {useMutation} from '@apollo/client'
import {Button, Center, Input, Stack, Text} from '@chakra-ui/react'
import {signIn} from 'next-auth/react'
import Image from 'next/image'
import {useState} from 'react'
import toast from 'react-hot-toast'

import type {Session} from 'next-auth'
import type {CreateUsernameData, CreateusernameVariables} from '@/graphql/types/user'

type AuthProps = {
  session: Session | null
  reloadSession: () => void
}

const Auth: React.FC<AuthProps> = ({session, reloadSession}) => {
  const [username, setUsername] = useState('')

  const [createUsername, {loading}] = useMutation<CreateUsernameData, CreateusernameVariables>(
    UserOperations.Mutations.createUsername
  )

  async function saveUsernameHandler() {
    if (!username) return

    try {
      const {data} = await createUsername({
        variables: {
          username,
        },
      })

      if (!data?.createUsername) {
        throw new Error()
      }

      if (data.createUsername.error) {
        const {
          createUsername: {error},
        } = data

        throw new Error(error)
      }

      toast.success('Username created!')
      reloadSession()
    } catch (error: any) {
      toast.error(error?.message)
    }
  }

  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Image
              className="rounded-full"
              src={session?.user.image}
              width={128}
              height={128}
              alt="Deren iMessage"
            ></Image>
            <Text fontSize="3xl">Create Username</Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button onClick={saveUsernameHandler}>Save</Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">Deren iMessage</Text>
            <Button className="w-full" onClick={() => void signIn()} isLoading={loading}>
              Sign In
            </Button>
          </>
        )}
      </Stack>
    </Center>
  )
}

export default Auth
