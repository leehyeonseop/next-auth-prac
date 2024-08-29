'use server';

import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import * as z from 'zod';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!!',
    };
  }

  const { name, email, password } = validatedFields.data;

  // bcrypt 이슈 => bcrypt.js
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  // TODO: Send verification token email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!!' };
};
