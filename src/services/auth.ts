import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/services/prisma";
import Credentials from "next-auth/providers/credentials";
import { GetUserByEmail } from "@/app/_actions";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
    newUser: "/",
    verifyRequest: "/",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "exemplo@sicoobuberaba.com.br",
        },
        password: { label: "Senha", type: "password", placeholder: "********" },
      },
      authorize: async (credentials) => {
        let user = null;

        user = await GetUserByEmail(credentials.email as string);

        if (!user) {
          return null;
        }

        const verifyPassword = bcrypt.compare(
          user.password,
          credentials.password as string
        );

        if (!verifyPassword) {
          return null;
        }

        return user;
      },
    }),
  ],
});
