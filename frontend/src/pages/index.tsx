import Auth from '@/components/Auth/Auth'
import Chat from '@/components/Chat/Chat'
import {Box, Button} from '@chakra-ui/react'
import {getSession, signIn, signOut, useSession} from 'next-auth/react'
import Head from 'next/head'

import {api} from '../utils/api'

import type {NextPage, NextPageContext} from 'next'

const Home: NextPage = () => {
  const {data: sessionData} = useSession()

  function reloadSession() {}

  return (
    <>
      <Head>
        <title>Deren iMessage</title>
        <meta name="Deren iMessage" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthShowcase />
        <Box>
          {sessionData?.user?.username ? (
            <Chat />
          ) : (
            <Auth session={sessionData} reloadSession={reloadSession} />
          )}
        </Box>
      </main>
    </>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  }
}

export default Home

const AuthShowcase: React.FC = () => {
  const {data: sessionData} = useSession()

  const {data: secretMessage} = api.example.getSecretMessage.useQuery(
    undefined, // no input
    {enabled: sessionData?.user !== undefined}
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button
        // className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </Button>
    </div>
  )
}
