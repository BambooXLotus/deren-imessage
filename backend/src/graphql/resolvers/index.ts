import merge from 'lodash.merge';

import ConversationResolvers from './conversation';
import MessageResolvers from './message';
import UserResolvers from './user';

const resolvers = merge({}, UserResolvers, ConversationResolvers, MessageResolvers)

export default resolvers;