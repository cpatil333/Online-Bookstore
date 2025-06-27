import { gql } from "apollo-server";

const typeDefs = gql`
  enum Role {
    ADMIN
    CUSTOMER
  }

  type User {
    id: ID!
    fullName: String!
    email: String!
    password: String!
    role: Role!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    price: Float!
    image: String!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    userId: Int!
    totalAmount: Float!
  }

  type OrderItem {
    id: ID!
    order: Order!
    book: Book!
    quantity: Int!
    price: Float!
  }

  type Query {
    users: [User!]!
    books: [Book!]!
    orders: [Order!]!
    orderItems: [OrderItem!]!
  }

  input UserInput {
    fullName: String!
    email: String!
    password: String!
    role: Role!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input BookInput {
    title: String!
    author: String!
    description: String!
    price: Float!
    image: String!
  }
  input OrderInput {
    userId: Int!
    totalAmount: Float!
  }

  input OrderItemsInput {
    orderId: Int!
    bookId: Int!
    quantity: Int!
    price: Float!
  }

  type Mutation {
    singup(newUser: UserInput!): AuthPayload!
    addBook(newBook: BookInput!): Book!
    addOrder(newOrder: OrderInput!): Order!
    addOrderItems(newOrderItems: OrderItemsInput!): OrderItem!
  }
`;

export default typeDefs;
