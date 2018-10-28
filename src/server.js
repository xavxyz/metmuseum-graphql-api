import '@babel/polyfill';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { typeDefs, resolvers } from './schema';
import { METFetcher } from './datasources';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    metFetcher: new METFetcher(),
  }),
  engine: process.env.ENGINE_API_KEY && {
    apiKey: process.env.ENGINE_API_KEY,
  },
});

server.listen().then(({ url }) => {
  console.log(`🎨  Server ready at ${url}`);
});
