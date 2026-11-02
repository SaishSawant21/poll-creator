import { NextResponse } from "next/server";
import { withAuth } from "../../../../lib/with-auth";
import { db } from "../../../../prisma/db";

export const GET = withAuth(async (req, context) => {
	try {
		const { userId } = context;

		const user = await db.orm.public.User
			.select('id', 'email', 'name', 'createdAt')
			.where({ id: userId })
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
});