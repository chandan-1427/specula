import { db } from "../database/index.js";
import { users } from "../database/schema.js";
import { eq, or } from "drizzle-orm";
import argon2 from "argon2";
import { sign } from "hono/jwt";
import type { SignupInput, LoginInput } from "../validations/auth.schema.js";
import { env } from "../config/env.js";

export class AuthService {
  /**
   * Register a new user.
   *
   * Performs an existence check before hashing the password to conserve CPU.
   * Throws an error if the email or username is already in use. On rare
   * race conditions a clear conflict error is returned instead of leaking
   * database details.
   */
  async signup(input: SignupInput) {
    // look up existing user before hashing the provided password
    const existing = await db.query.users.findFirst({
      where: or(eq(users.email, input.email), eq(users.username, input.username)),
    });

    if (existing) {
      const field = existing.email === input.email ? "Email" : "Username";
      throw new Error(`${field} already registered`);
    }

    // hash the password after confirming uniqueness
    const hashedPassword = await argon2.hash(input.password);

    try {
      const [newUser] = await db.insert(users).values({
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

      return newUser;
    } catch (error: any) {
      // handle potential concurrent insert conflict
      if (error.code === "23505") {
        throw new Error("Conflict: User data updated simultaneously. Please try again.");
      }
      throw error; 
    }
  }

  /**
   * Authenticate a user and issue JWT access/refresh tokens.
   *
   * A constant‑time verification strategy is used to avoid timing attacks
   * when the account does not exist.
   *
   * @throws Error if credentials are invalid.
   */
  async login(input: LoginInput) {
    // find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    // verify password (or dummy hash when user missing) to keep timing constant
    const dummyHash = "$argon2id$v=19$m=65536,t=3,p=4$6P6..."; 
    const isValid = user 
      ? await argon2.verify(user.password, input.password) 
      : await argon2.verify(dummyHash, "dummy_password");

    if (!user || !isValid) {
      throw new Error("Invalid email or password");
    }

    // build token payloads with expiration timestamps
    const now = Math.floor(Date.now() / 1000);
    
    const accessToken = await sign({
      sub: user.id,
      role: "user",
      exp: now + (60 * 15),
      iat: now,
    }, env.JWT_SECRET, "HS256");

    const refreshToken = await sign({
      sub: user.id,
      exp: now + (60 * 60 * 24 * 7),
      iat: now,
    }, env.JWT_REFRESH_SECRET, "HS256");

    return {
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    };
  }
}