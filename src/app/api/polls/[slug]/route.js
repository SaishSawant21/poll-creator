import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/auth-token";
import { getPollBySlug, checkIfVoted } from "../../../../services/poll.service";

const STATUS_BY_CODE = {
  POLL_NOT_FOUND: 404,
};

export const GET = async (req, { params }) => {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let userId = null;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("pollify_token")?.value;
    if (authToken) {
      const payload = await verifyToken(authToken);
      if (payload && payload.userId) userId = payload.userId;
    }

    const voterToken = cookieStore.get("voter_token")?.value;

    const poll = await getPollBySlug(slug);

    const hasVoted = await checkIfVoted(poll.id, userId, voterToken);

    return NextResponse.json(
      {
        code: 200,
        message: "Poll fetched successfully",
        data: { ...poll, hasVoted }
      },
      { status: 200 }
    );
  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;

    if (status === 500) {
      console.error("Fetch single poll error:", error);
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