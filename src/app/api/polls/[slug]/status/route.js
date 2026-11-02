import { NextResponse } from "next/server";
import { withAuth } from "../../../../../lib/with-auth";
import { updatePollStatus } from "../../../../../services/poll.service";

const STATUS_BY_CODE = {
  INVALID_STATUS: 400,
  FORBIDDEN: 403,
  POLL_NOT_FOUND: 404,
};

export const PATCH = withAuth(async (req, context) => {
  try {
    const { userId, params } = context;

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ code: 400, message: "Invalid JSON" }, { status: 400 });
    }

    const updatedPoll = await updatePollStatus(userId, slug, body.status);

    return NextResponse.json(
      { code: 200, message: "Poll status updated", data: updatedPoll },
      { status: 200 }
    );

  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;

    if (status === 500) {
      console.error("Update poll status error:", error);
      return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ code: status, message: error.message }, { status });
  }
});