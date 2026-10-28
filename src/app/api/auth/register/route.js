import { NextResponse } from "next/server";
import { registerUser } from "../../../../services/auth.service";

const STATUS_BY_CODE = {
  INVALID_EMAIL: 400,
  INVALID_PASSWORD: 400,
  INVALID_NAME: 400,
  EMAIL_TAKEN: 409,
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
    await registerUser(body || {});
    
    return NextResponse.json(
      { 
        code: 201, 
        message: "User registered successfully" 
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;
    
    if (status === 500) {
      console.error("Register error:", error);
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