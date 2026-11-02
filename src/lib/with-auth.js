import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./auth-token";

// This is a Higher-Order Function
export const withAuth = (handler) => {
  return async (req, context) => {
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

      // Inject the userId into the context so the route handler can use it
      const enrichedContext = { ...context, userId: payload.userId };

      // Call the original route handler
      return await handler(req, enrichedContext);

    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
  };
};