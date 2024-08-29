// ctrl shift p reload window fast

import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from './auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import { getUserById } from './data/user';
import 'next-auth/jwt';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt: async ({ token, user, profile }) => {
      // user, profile => undefined => ?
      //   console.log({ token, user });
      //   token.customField = 'zz';
      // 여기에서 토큰에 임의의 필드를 설정하면 session의 토큰에도 저장됨? => 둘이 identical 함
      // 기본적으로 token에는 사용자 프로필과 관련한 최소한의 정보만을 jwt에 포함. (보안 + 토큰 크기 최소화)

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    session: async ({ session, token }) => {
      console.log({ session, token });

      //   if (session.user) {
      //     session.user.customField = token.customField;
      //   }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },

    // signIn: async ({ user }) => {
    //   console.log('일단 여기서 user : ', user.id);

    //   if (user.id) {
    //     const existingUser = await getUserById(user.id);

    //     if (!existingUser || !existingUser.emailVerified) {
    //       return false;
    //     }
    //   }

    signIn: async ({ user, account }) => {
      console.log('SignIn');
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      if (user.id) {
        const existingUser = await getUserById(user.id);

        // Prevent Sign in without email verification
        if (!existingUser?.emailVerified) return false;

        // TODO : Add 2FA check
      }

      return true;
    },

    //   // true를 리턴한다는것은 allow sign in
    //   return true;
    // },
  },
  events: {
    // OAuth 로 로그인한 사람들은 email Verified를 해줄필요가 없음.
    // emailVerified를 bool 대신 date로 추후 뭐 바뀌거나 할때 오래된거면 유용.

    linkAccount: async ({ user }) => {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  pages: {
    // 만약 구글 로그인을 하고 github 로그인할때 이메일이 같다면? => auth.js에서 자동으로 생성해주는 이상한 페이지로 이동됨. 우리 페이지로 보여주자.
    signIn: '/auth/login',
    error: '/auth/login',
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  // db 세션을 사용하지 않아서 model schema에 추가하지 않음.
  // 왜냐하면 Prisma 로 dbsession 을 사용할 수 없음(?) 엣지 환경에서 안돌아가서?
  ...authConfig,
});
