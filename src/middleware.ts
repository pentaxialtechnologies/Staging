import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
 if(!process.env.NEXTAUTH_SECRET) {
  throw new Error('Token not found')
 }
  const token = await getToken({ req, secret:process.env.NEXTAUTH_SECRET});
console.log('Middleware token:', token);



  const { pathname } = req.nextUrl;

  const publicPaths = ["/","/users/login","jobs"];

  // Allow public paths without auth
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

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
    return NextResponse.redirect(new URL("/users/login", req.url));
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
