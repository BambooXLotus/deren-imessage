import '../styles/globals.css'

import {client} from '@/graphql/apollo-client'
import {ApolloProvider} from '@apollo/client/react'
import {ChakraProvider} from '@chakra-ui/react'
import {SessionProvider} from 'next-auth/react'
import {Toaster} from 'react-hot-toast'

import {theme} from '../chakra/theme'
import {api} from '../utils/api'

import type {Session} from 'next-auth'
import type {AppType} from 'next/app'
const MyApp: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <Toaster />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default api.withTRPC(MyApp)
