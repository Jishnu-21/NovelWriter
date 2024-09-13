// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://novelwriter.onrender.com/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
