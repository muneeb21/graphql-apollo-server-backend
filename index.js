const { ApolloServer, gql } = require('apollo-server');

const mongoose = require('./config/mongoose')

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
// The GraphQL schema
const authMiddleware= require('./jwt/jwtAuth');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  centext: authMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});