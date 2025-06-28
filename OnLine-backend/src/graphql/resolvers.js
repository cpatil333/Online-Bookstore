import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import isAuth from "../utils/isAuth.js";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
  },

  Mutation: {
    singup: async (_, { newUser }) => {
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
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET
      );
      return { token, user };
    },

    addBook: async (_, { newBook }, { user }) => {
      isAuth(user);
      return await prisma.book.create({
        data: {
          ...newBook,
        },
      });
    },

    updateBook: async (_, { updateBook }, { user }) => {
      isAuth(user);
      const BookId = parseInt(updateBook.id);
      const existBookId = await prisma.book.findUnique({
        where: { id: BookId },
      });
      if (!existBookId) {
        throw new Error("Book Id does not exist!");
      }
      const updatedBook = await prisma.book.update({
        where: { id: BookId },
        data: {
          title: updateBook.title,
          author: updateBook.author,
          description: updateBook.description,
          price: parseFloat(updateBook.price),
          image: updateBook.image,
          stock: parseInt(updateBook.stock),
        },
      });
      return updatedBook;
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
