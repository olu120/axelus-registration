// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };


export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";

  if (!user || !pass) {
    return new NextResponse(
      "Admin not configured: set ADMIN_USER and ADMIN_PASS in your environment.",
      { status: 500 }
    );
  }

  if (!auth || !auth.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const encoded = auth.split(" ")[1] || "";
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  // Auth OK → continue
  return NextResponse.next();
}
