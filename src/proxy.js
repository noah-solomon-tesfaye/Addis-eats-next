import { NextResponse } from "next/server";
import { auth } from "../auth";

export const proxy = auth((request) => {
  if (!request.auth) {
    const signInUrl = new URL("/signin", request.url);

    signInUrl.searchParams.set(
      "next",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};