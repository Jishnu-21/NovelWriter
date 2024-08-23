const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Message {
        role: String!
        content: String!
    }

    type Query {
        hello: String
    }

    type Mutation {
        sendMessage(messages: [MessageInput!]!): Message
    }

    input MessageInput {
        role: String!
        content: String!
    }
`;

module.exports = typeDefs;
