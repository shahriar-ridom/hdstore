import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

type Session = {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string;
    role?: string;
  };
  session: {
    id: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
  };
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fetch the session via API
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // Admin Route Protection
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protected User Routes
  if (pathname.startsWith("/orders")) {
    if (!session) {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auth Route Redirects
  if (pathname.startsWith("/sign-in")) {
    if (session) {
      const url = new URL("/orders", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/sign-in/:path*"],
};
