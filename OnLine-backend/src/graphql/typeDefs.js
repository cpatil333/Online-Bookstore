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
    stock: Int!
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

  input UserInput {
    fullName: String!
    email: String!
    password: String!
    role: Role!
  }

  input UpdateUserInput {
    id: ID!
    fullName: String!
    email: String!
    password: String!
    role: Role!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddBookInput {
    title: String!
    author: String!
    description: String!
    price: Float!
    image: String!
    stock: Int!
  }
  
  input UpdateBookInput {
    id: ID!
    title: String!
    author: String!
    description: String!
    price: Float!
    image: String!
    stock: Int!
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
  input OrderItemInput {
    bookId: ID!
    quantity: Int!
  }

  type Query {
    users: [User!]!
    books: [Book!]!
    bookById(id: ID!): Book!
    orders: [Order!]!
    getUserById(id: ID!): User!
  }

  type Mutation {
    signup(newUser: UserInput!): AuthPayload!
    login(loginUser: LoginInput!): AuthPayload!
    updateUser(updateUser: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    addBook(newBook: AddBookInput!): Book!
    updateBook(updateBook: UpdateBookInput!): Book!
    deleteBook(id: ID!): Book
    # //Order
    placeOrder(items: [OrderItemInput!]!): Order!
  }
`;

export default typeDefs;
