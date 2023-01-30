import type { CreateUsernameResponse, GraphQLContext } from './../util/types';

const resolvers = {
  Query: {
    searchUsers: () => { }
  },
  Mutation: {
    createUsername: async (_: any, args: { username: string }, context: GraphQLContext): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context

      if (!session?.user) {
        return {
          error: "Not Authorized"
        }
      }

      const { id } = session.user

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username
          }
        })

        if (existingUser) {
          return {
            error: "Username already taken. Try a diffrent Username"
          }
        }

        await prisma.user.update({
          where: {
            id
          },
          data: {
            username
          }
        })

        return { success: true }
      } catch (error: any) {
        console.log(error)
        return {
          error: error?.message
        }
      }
    }
  },
}

export default resolvers