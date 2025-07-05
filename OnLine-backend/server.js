import { ApolloServer } from "@apollo/server";
import typeDefs from "./src/graphql/typeDefs.js";
import resolvers from "./src/graphql/resolvers.js";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import routeUploads from "./src/middleware/upload.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/uploads", routeUploads)
//app.use("/uploads", express.static("uploads"))
// ✅ Make 'uploads' publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
app.use((req, res, next) => {
  if (!req.body && process.env.NODE_ENV !== "production") {
    req.body = {};
  }
  next();
});
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeaders = req.headers.authorization || "";
      const token = authHeaders.startsWith("Bearer ")
        ? authHeaders.split(" ")[1]
        : authHeaders;
      let user = null;

      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
          console.log("JWT Error ", error.message);
        }
      }
      return { user, prisma };
    },
  })
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql `);
});
