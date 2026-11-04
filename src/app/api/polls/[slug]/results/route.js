import { NextResponse } from "next/server";
import { getPollResults } from "../../../../../services/poll.service";

const STATUS_BY_CODE = {
  POLL_NOT_FOUND: 404,
};

export const GET = async (req, { params }) => {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const results = await getPollResults(slug);

    return NextResponse.json(
      { code: 200, message: "Results fetched successfully", data: results },
      { status: 200 }
    );
  } catch (error) {
    const status = STATUS_BY_CODE[error.code] || 500;

    if (status === 500) {
      console.error("Fetch results error:", error);
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