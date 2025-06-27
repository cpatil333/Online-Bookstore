import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
  },
};

export default resolvers;