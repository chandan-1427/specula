import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign } from "hono/jwt";
import { verify } from "hono/jwt";
import { signupSchema, loginSchema } from "../validations/auth.schema.js";
import { AuthService } from "../services/auth.service.js";
import { getCookie, setCookie } from "hono/cookie";
import { env } from "../config/env.js";

/**
 * Authentication router.
 *
 * Provides endpoints for signing up, logging in, refreshing tokens
 * and logging out. All incoming request bodies are validated against
 * Zod schemas before controller logic runs.
 */
const auth = new Hono();
const authService = new AuthService();

auth.post("/signup", zValidator("json", signupSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    const user = await authService.signup(validatedData);

    return c.json({
      success: true,
      message: "Registration successful",
      data: user,
    }, 201);
  } catch (error: any) {
    // distinguish known conflict/validation errors from unexpected failures
  if (error.message.includes("already registered") || error.message.includes("already taken")) {
    return c.json({ success: false, message: error.message }, 409);
    }

    console.error(`[Signup Error]: ${error.stack}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const { user, accessToken, refreshToken } = await authService.login(body);

    // store the refresh token in an http-only cookie
    setCookie(c, "refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
      success: true,
      message: "Login successful",
      accessToken,
      user,
    }, 200);

  } catch (error: any) {
    // Generic message to prevent user enumeration
    return c.json({ 
      success: false, 
      message: "Invalid email or password" 
    }, 401);
  }
});

auth.post("/refresh", async (c) => {
  // read refresh token from secure cookie
  const refreshToken = getCookie(c, "refresh_token");

  if (!refreshToken) {
    return c.json({ success: false, message: "No refresh token" }, 401);
  }

  try {
    // validate the refresh token signature
    const payload = await verify(refreshToken, env.JWT_REFRESH_SECRET, "HS256");
    const userId = payload.sub as string;

    // issue new access token with updated expiration
    const now = Math.floor(Date.now() / 1000);
    const newAccessToken = await sign({
      sub: userId,
      role: "user",
      exp: now + (60 * 15),
      iat: now,
    }, env.JWT_SECRET);

    return c.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    // If Refresh Token is expired or tampered with
    return c.json({ success: false, message: "Invalid session" }, 401);
  }
});

auth.post("/logout", (c) => {
  // Clear the cookie by setting it to expire immediately
  setCookie(c, "refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 0, 
  });

  return c.json({ success: true, message: "Logged out" });
});

export default auth;