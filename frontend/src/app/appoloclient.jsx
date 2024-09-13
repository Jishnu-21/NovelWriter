// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://novelwriter.onrender.com/graphql', t
  cache: new InMemoryCache(),
});

export default client;
