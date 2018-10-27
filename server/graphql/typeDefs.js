import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Message {
    id: ID!
    content: String
}
type Query {
  messages: [Message!]!
}
type Mutation {
  addMessage(message: String!): [String!]!
}
type Subscription {
  messageAdded: Message
}
`;

export default typeDefs