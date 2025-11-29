// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("MIDDLEWARE RUNNING", req.nextUrl.pathname);
  // return NextResponse.redirect(new URL("/", req.url));

  // Read profile from cookies instead of localStorage
  // const profileCookie = req.cookies.get("profile")?.value;
  // const profile = profileCookie ? JSON.parse(profileCookie) : null;
  // const { pathname } = req.nextUrl;
  // const publicRoutes = ["/", "/register"];
  // if (publicRoutes.includes(pathname)) {
  //   return NextResponse.next();
  // }
  //
  // if (!profile || !profile.id) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  //
  // if (pathname.startsWith("/mecanico") && profile.userType !== "mechanic") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  //
  // if (pathname.startsWith("/admin") && profile.userType !== "admin") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  //
  // if (pathname.startsWith("/client") && profile.userType !== "user") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  //
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mecanico",
    // "/admin",
    // "/cliente",
    // "/registro",
  ],
};

