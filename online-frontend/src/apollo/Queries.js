import { gql } from "@apollo/client";

export const GET_USER_LIST = gql`
  query {
    users {
      id
      fullName
      email
      role
    }
  }
`;

export const GET_USER_ID = gql`
  query ($getUserById: ID!) {
    getUserById(id: $getUserById) {
      id
      fullName
      email
      role
    }
  }
`;

export const GET_BOOK_LIST = gql`
  query {
    books {
      id
      title
      author
      stock
      image
      price
    }
  }
`;

export const GET_BOOK_ID = gql`
  query ($bookById: ID!) {
    bookById(id: $bookById) {
      id
      title
      author
      description
      image
      price
      stock
    }
  }
`;

export const GET_ORDERS_LIST = gql`
  query {
    orders {
      id
      userId
      user {
        fullName
      }
      totalAmount
      items {
        id
        bookId
        book {
          title
        }
        quantity
        price
      }
    }
  }
`;
