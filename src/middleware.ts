import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret:"fallback-secret-key"});
  console.log(token,"token");
  
  const { pathname } = req.nextUrl;

  const publicPaths = ["/", "/worker/login", "/worker/register","providers/login","providers/register"];

  // Allow public paths without auth
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  console.log("Token in middleware:", token);

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/users/login", req.url));
  }

  try {
    const role = (token.role as string)?.toLowerCase();

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/employer") && role !== "employer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/provider") && role !== "provider") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // if (pathname.startsWith("/company") && role !== "company") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }



    // All checks passed
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/worker/login", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employer/:path*",  // make sure this matches your actual URL structure
    "/provider/:path*",
    "/company/:path*",
  ],
};
