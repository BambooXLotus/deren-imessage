import {Button, Center, Input, Stack, Text} from '@chakra-ui/react'
import type {Session} from 'next-auth'
import {signIn} from 'next-auth/react'
import Image from 'next/image'

import deren128 from '@/images/deren-128.png'
import {useState} from 'react'

type AuthProps = {
  session: Session | null
  reloadSession: () => void
}

const Auth: React.FC<AuthProps> = ({session, reloadSession}) => {
  const [username, setUsername] = useState('')

  function saveUsernameHandler() {
    try {
      // createUsername mutation to send our username to the GraphQL API
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        <Image
          className="rounded-full"
          src={deren128.src}
          width={256}
          height={256}
          alt="Deren iMessage"
        ></Image>

        {session ? (
          <>
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
            <Button className="w-100" onClick={() => void signIn()}>
              Sign In
            </Button>
          </>
        )}
      </Stack>
    </Center>
  )
}

export default Auth
