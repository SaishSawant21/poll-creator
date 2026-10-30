import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/auth-token"; // Check your relative path
import { createPoll } from "../../../services/poll.service"; // Check your relative path

const STATUS_BY_CODE = {
  INVALID_POLL_DATA: 400,
  UNAUTHORIZED: 401,
};

export const POST = async (req) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pollify_token")?.value;
    if (!token) {
      return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ code: 401, message: "Invalid token" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ code: 400, message: "Invalid JSON" }, { status: 400 });
    }

    const poll = await createPoll(payload.userId, body || {});

    return NextResponse.json(
      { code: 201, message: "Poll created successfully", data: poll },
      { status: 201 }
    );

  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;

    if (status === 500) {
      console.error("Create poll error:", error);
      return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ code: status, message: error.message }, { status });
  }
};