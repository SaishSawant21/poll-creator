import { NextResponse } from "next/server";
import { loginUser } from "../../../../services/auth.service";

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
    // We don't need the user data in the response yet, but the service validates it
    console.log(body);
    await loginUser(body || {});

    return NextResponse.json(
      {
        code: 200,
        message: "Login successful"
      },
      { status: 200 }
    );

  } catch (error) {
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