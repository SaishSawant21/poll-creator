import { NextResponse } from "next/server";
import { withAuth } from "../../../lib/with-auth";
import { createPoll, getPublicPolls } from "../../../services/poll.service";

const STATUS_BY_CODE = {
	INVALID_POLL_DATA: 400,
	UNAUTHORIZED: 401,
};

export const POST = withAuth(async (req, context) => {
	try {
		const { userId } = context;

		let body;
		try {
			body = await req.json();
		} catch {
			return NextResponse.json({ code: 400, message: "Invalid JSON" }, { status: 400 });
		}

		const poll = await createPoll(userId, body || {});

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
});

export const GET = async () => {
	try {
		const polls = await getPublicPolls();

		return NextResponse.json(
			{ code: 200, message: "Polls fetched successfully", data: polls },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Fetch polls error:", error);
		return NextResponse.json(
			{ code: 500, message: "Internal server error" },
			{ status: 500 }
		);
	}
};