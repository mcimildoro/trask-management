import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of paths that don't require authentication
const publicPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check for session cookie
  const session = request.cookies.get("session")?.value;
  
  // If no session and not a public path, redirect to login
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  
  // If session exists, continue (Firebase will verify it in the API routes)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};