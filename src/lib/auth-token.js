import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return new TextEncoder().encode(secret);
};

// 1. Generate a token
export const signToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) 
    .setIssuedAt()                        
    .setExpirationTime("1d")             
    .sign(getSecretKey());
};

// 2. Verify a token
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    return null; // Invalid or expired token
  }
};