import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import isAuth from "../utils/isAuth.js";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async (_, __, { user }) => {
      isAuth(user);
      return await prisma.user.findMany();
    },

    getUserById: async (_, { id }, { user }) => {
      isAuth(user);
      const userId = parseInt(id);

      const existUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existUser) {
        throw new Error("No such type user exist.!");
      }

      return existUser;
    },

    books: async (_, __, { user }) => {
      isAuth(user);
      return await prisma.book.findMany();
    },

    bookById: async (_, { id }, { user }) => {
      isAuth(user);
      const bookId = parseInt(id);
      return await prisma.book.findUnique({
        where: { id: bookId },
      });
    },

    orders: async () => {
      return await prisma.order.findMany();
    },

    items: async () => {
      return await prisma.orderItems.findMany();
    },
  },

  Order: {
    user: async (parent, _) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    items: async (parent, _) => {
      return await prisma.orderItems.findMany({
        where: { orderId: parent.id },
      });
    },
  },
  
  OrderItems: {
    book: async (parent, _) => {
      return await prisma.book.findUnique({
        where: { id: parent.bookId },
      });
    },
  },

  Mutation: {
    signup: async (_, { newUser }) => {
      const existEmail = await prisma.user.findFirst({
        where: { email: newUser.email },
      });
      if (existEmail) {
        throw new Error("Email already exist!!");
      }

      const hassedPassword = await bcryptjs.hash(newUser.password, 10);

      const user = await prisma.user.create({
        data: {
          ...newUser,
          password: hassedPassword,
        },
      });
      const token = await jwt.sign(
        {
          fullName: user.fullName,
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET
      );
      return {
        token,
        user,
      };
    },

    login: async (_, { loginUser }) => {
      const user = await prisma.user.findFirst({
        where: { email: loginUser.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const matchedPassword = await bcryptjs.compare(
        loginUser.password,
        user.password
      );
      if (!matchedPassword) {
        throw new Error("Invalid email and password!");
      }
      const token = await jwt.sign(
        {
          fullName: user.fullName,
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET
      );
      return { token, user };
    },

    updateUser: async (_, { updateUser }, { user }) => {
      isAuth(user);
      const userId = parseInt(updateUser.id);

      const existUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existUser) {
        throw new Error("No such type user exist.!");
      }

      const hassedPassword = await bcryptjs.hash(updateUser.password, 10);

      const udpateData = await prisma.user.update({
        where: { id: existUser.id },
        data: {
          fullName: updateUser.fullName,
          email: updateUser.email,
          password: hassedPassword,
          role: updateUser.role,
        },
      });
      return udpateData;
    },

    deleteUser: async (_, { id }, { user }) => {
      isAuth(user);
      const userId = parseInt(id);
      const existUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existUser) {
        throw new Error("User does not exist!");
      }
      await prisma.user.delete({
        where: { id: userId },
      });
      const message = "User deleted!";
      return message;
    },

    addBook: async (_, { newBook }, { user }) => {
      isAuth(user);
      return await prisma.book.create({
        data: {
          ...newBook,
        },
      });
    },

    updateBook: async (_, { editBook }, { user }) => {
      isAuth(user);
      const BookId = parseInt(editBook.id);
      const existBookId = await prisma.book.findUnique({
        where: { id: BookId },
      });
      if (!existBookId) {
        throw new Error("Book Id does not exist!");
      }
      const updateData = await prisma.book.update({
        where: { id: existBookId.id },
        data: {
          title: editBook.title,
          author: editBook.author,
          description: editBook.description,
          price: parseFloat(editBook.price),
          image: editBook.image,
          stock: parseInt(editBook.stock),
        },
      });
      return updateData;
    },

    deleteBook: async (_, { id }, { user }) => {
      isAuth(user);
      const BookId = parseInt(id);
      const existBookId = await prisma.book.findUnique({
        where: { id: BookId },
      });
      if (!existBookId) {
        throw new Error("Book Id does not exist!");
      }
      await prisma.book.delete({
        where: { id: BookId },
      });
      const message = "Book Id deleted!";
      return message;
    },

    placeOrder: async (_, { items }, { user }) => {
      isAuth(user);
      //console.log(user);
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const mbookId = parseInt(item.bookId);
          const book = await prisma.book.findUnique({
            where: { id: mbookId },
          });

          if (!book) {
            throw new Error(`Book with ${item.bookId} not found`);
          }

          return {
            bookId: mbookId,
            quantity: item.quantity,
            price: book.price * item.quantity,
          };
        })
      );

      const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

      const order = await prisma.order.create({
        data: {
          userId: user.userId,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true, // ✅ Return order with items
        },
      });

      return order;
    },
  },
};

export default resolvers;
