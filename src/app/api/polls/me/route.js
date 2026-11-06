import { NextResponse } from "next/server";
import { withAuth } from "../../../../lib/with-auth";
import { getUserPolls } from "../../../../services/poll.service";

export const GET = withAuth(async (req, context) => {
  try {
    const { userId } = context;

    const polls = await getUserPolls(userId);

    return NextResponse.json(
      { code: 200, message: "User polls fetched", data: polls },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch my polls error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
});