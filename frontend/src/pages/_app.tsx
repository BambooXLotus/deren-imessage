import '@/styles/globals.css'

import {ChakraProvider} from '@chakra-ui/react'
import {SessionProvider} from 'next-auth/react'

import {theme} from '../chakra/theme'
import {api} from '../utils/api'

import type {Session} from 'next-auth'
import type {AppType} from 'next/app'
import {ApolloProvider} from '@apollo/client/react'
import {client} from '@/graphql/apollo-client'

const MyApp: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default api.withTRPC(MyApp)
