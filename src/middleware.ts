import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "wine-cellar-session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production-32chars"
);

const PUBLIC_PATHS = ["/login", "/~offline", "/serwist"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static files
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/api/ping") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  // Check session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
