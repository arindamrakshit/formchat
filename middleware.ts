import { NextRequest, NextResponse } from "next/server";

// HTTP Basic auth for the owner dashboard and admin API. Public form routes stay open.
export function middleware(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return NextResponse.next(); // open in local dev when unset
  const h = req.headers.get("authorization");
  if (h?.startsWith("Basic ")) {
    const pass = atob(h.slice(6)).split(":").slice(1).join(":");
    if (pass === pw) return NextResponse.next();
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Dashboard"' } });
}
export const config = { matcher: ["/dashboard/:path*", "/api/forms/:path*"] };
