import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    // 1. Create a successful response
    const response = NextResponse.json(
      { code: 200, message: "Logged out successfully" },
      { status: 200 }
    );

    // 2. Clear the cookie by setting its maxAge to 0
    response.cookies.set("pollify_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // <-- This tells the browser to delete it immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};