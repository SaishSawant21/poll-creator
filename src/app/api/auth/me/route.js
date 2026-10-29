import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/auth-token";
import { db } from "../../../../prisma/db";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pollify_token")?.value;

    if (!token) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await db.orm.public.User
      .select('id', 'email', 'name', 'createdAt')
      .where({ id: payload.userId })
      .first();

    if (!user) {
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { code: 200, message: "User fetched successfully", data: user },
      { status: 200 }
    );

  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};