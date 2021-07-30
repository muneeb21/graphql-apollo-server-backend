const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    ObjectId: String!
    email: String!
    token: String
  }
  type Message {
    userId: String!
    message: String!
    groupId: String!
  }
  type Group{
    ObjectId: String!
    name: String!
    users: [String]!
  }
  type Query {
    getGroups(pageNo: Int!): [Group]!
    login(email: String!, password: String!): User!
    getMessages(groupId: String!): [Message]!
  }
  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(groupId: String!, message: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`
