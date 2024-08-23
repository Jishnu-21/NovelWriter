const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
        console.error('Apollo Server Error:', err);
        return err;
    },
});

module.exports = apolloServer;
