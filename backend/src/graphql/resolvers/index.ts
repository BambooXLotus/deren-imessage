import merge from 'lodash.merge';

import conversationResolvers from './conversation';
import userResolvers from './user';

const resolvers = merge({}, userResolvers, conversationResolvers)

export default resolvers;