import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../../lib/auth-token";
import { castVote } from "../../../../../services/poll.service";

const STATUS_BY_CODE = {
  INVALID_INPUT: 400,
  INVALID_OPTION: 400,
  POLL_CLOSED: 403,
  POLL_EXPIRED: 403,
  LOGIN_REQUIRED: 401,
  POLL_NOT_FOUND: 404,
  ALREADY_VOTED: 409,
  INVALID_IDENTITY: 400,
};

export const POST = async (req, { params }) => {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 1. Optional Auth: Check if user is logged in
    let userId = null;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("pollify_token")?.value;
    if (authToken) {
      const payload = await verifyToken(authToken);
      if (payload && payload.userId) {
        userId = payload.userId;
      }
    }

    // 2. Optional Guest Token: Check if guest has voted before
    const voterToken = cookieStore.get("voter_token")?.value;

    // 3. Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ code: 400, message: "Invalid JSON" }, { status: 400 });
    }

    // 4. Cast the vote
    const { newTokenForGuest } = await castVote({
      slug,
      optionId: body.optionId,
      userId,
      voterToken
    });

    const response = NextResponse.json(
      { code: 201, message: "Vote cast successfully" },
      { status: 201 }
    );

    // 5. If this was a guest's first vote, set the cookie so they can't vote again
    if (newTokenForGuest) {
      response.cookies.set("voter_token", newTokenForGuest, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;

    if (status === 500) {
      console.error("Vote error:", error);
      return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ code: status, message: error.message }, { status });
  }
};