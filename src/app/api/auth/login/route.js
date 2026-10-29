import { NextResponse } from "next/server";
import { loginUser } from "../../../../services/auth.service";
import { signToken } from "../../../../lib/auth-token";

const STATUS_BY_CODE = {
  INVALID_INPUT: 400,
  INVALID_CREDENTIALS: 401,
};

export const POST = async (req) => {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { code: 400, message: "Invalid JSON body" }, 
      { status: 400 }
    );
  }

  try {
    const user = await loginUser(body || {});
    const token = await signToken({ userId: user.id });

    const response = NextResponse.json(
      { code: 200, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("pollify_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, 
      path: "/",
    });

    return response; 
  }catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;
    
    if (status === 500) {
      console.error("Login error:", error);
      return NextResponse.json(
        { code: 500, message: "Internal server error" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { code: status, message: error.message }, 
      { status }
    );
  }
};