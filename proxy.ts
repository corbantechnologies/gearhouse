import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nextAuthMiddleware from "next-auth/middleware";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host");

  // Redirect gearhouse.co.ke to www.gearhouse.co.ke
  if (hostname === "gearhouse.co.ke") {
    url.hostname = "www.gearhouse.co.ke";
    return NextResponse.redirect(url, 301);
  }

  // Handle NextAuth
  return (nextAuthMiddleware as any)(request);
}

export const config = {
  matcher: ["/(private)/:path*", "/orders/:path*", "/checkout/:path*"],
};
