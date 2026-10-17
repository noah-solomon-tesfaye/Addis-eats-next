import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const users = [
  {
    id: "usr_31",
    name: "Abi",
    phone: "0911000000",
    passwordHash: bcrypt.hashSync("AddisEats123!", 10),
    role: "customer",
  },
  {
    id: "usr_admin",
    name: "Addis Eats Admin",
    phone: "0900000000",
    passwordHash: bcrypt.hashSync("AdminChangeMe123!", 10),
    role: "admin",
  },
  {
    id: "usr_staff",
    name: "Addis Eats Kitchen Staff",
    phone: "0912000000",
    passwordHash: bcrypt.hashSync("KitchenChangeMe123!", 10),
    role: "staff",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const phone =
          typeof credentials?.phone === "string"
            ? credentials.phone.trim()
            : "";

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!phone || !password) {
          return null;
        }

        const user = users.find((item) => item.phone === phone);

        if (!user) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
});