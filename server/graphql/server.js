// ./server/graphql/server.js

import { ApolloServer } from 'apollo-server-express';
import config from '../../config';

import typeDefs from './typeDefs.js';
import resolvers from './resolvers';

const server =  new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});

export default server
