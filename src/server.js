import '@babel/polyfill';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema';
import { METFetcher } from './datasources';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    metFetcher: new METFetcher(),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🎨  Server ready at ${url}`);
});
