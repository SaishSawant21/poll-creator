import bcrypt from "bcryptjs";
import { db } from "../prisma/db";           
import { normalizeEmail, normalizeName, isValidEmail, isValidPassword } from "../lib/validators";
import { appError } from "../lib/errors";
const SALT_ROUNDS = 12;

export const registerUser = async ({ email, password, name }) => {
  if (!isValidEmail(email)) {
    throw appError('INVALID_EMAIL', 'A valid email is required')
  }
  if (!isValidPassword(password)) {
    throw appError('INVALID_PASSWORD', 'Password must be at least 8 characters')
  }

  const normalizedName = normalizeName(name)
  if (normalizedName === undefined) {
    throw appError('INVALID_NAME', 'Name must be a string')
  }

  const normalizedEmail = normalizeEmail(email)

  const existing = await db.orm.public.User
    .where({ email: normalizedEmail })
    .first();

    if (existing) {
    throw appError('EMAIL_TAKEN', 'Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await db.orm.public.User
    .select('id', 'email', 'name', 'createdAt')
    .create({
      email: normalizedEmail,
      passwordHash: passwordHash,
      name: normalizedName,
    })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export const loginUser = async ({ email, password }) => {
  if (!isValidEmail(email) || !password) {
    throw appError('INVALID_INPUT', 'Valid email and password are required');
  }

  const normalizedEmail = normalizeEmail(email);

  // 1. Find the user
  const user = await db.orm.public.User
    .where({ email: normalizedEmail })
    .first();

  // 2. Generic error if user doesn't exist (prevents email enumeration)
  if (!user || !user.passwordHash) {
    throw appError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  // 3. Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw appError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  // 4. Return user data (we will use this for sessions/JWT later)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};