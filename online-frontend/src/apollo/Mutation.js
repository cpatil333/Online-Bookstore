import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  mutation ($loginUser: LoginInput!) {
    login(loginUser: $loginUser) {
      token
      user {
        id
        fullName
        role
      }
    }
  }
`;

export const USER_REGISTER = gql`
  mutation ($newUser: UserInput!) {
    signup(newUser: $newUser) {
      token
      user {
        id
        fullName
        role
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation ($newUser: UserInput!) {
    signup(newUser: $newUser) {
      user {
        id
        fullName
        role
      }
    }
  }
`;

export const UDPATE_USER = gql`
  mutation ($updateUser: updateUserInput!) {
    updateUser(updateUser: $updateUser) {
      id
      fullName
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      id
      fullName
      email
      role
    }
  }
`;

export const ADD_BOOK = gql`
  mutation ($newBook: AddBookInput!) {
    addBook(newBook: $newBook) {
      id
      title
      description
      author
      image
      price
      stock
    }
  }
`;

export const UDPATE_BOOK = gql`
  mutation ($editBook: UpdateBookInput!) {
    updateBook(editBook: $editBook) {
      id
      title
      author
    }
  }
`;
