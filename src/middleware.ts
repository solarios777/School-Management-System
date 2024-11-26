import authConfig from "../auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  routeAccessMap,
  DEFAULT_LOGIN_REDIRECT
} from "../routes";
import { currentUser } from "./lib/auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const requestedPath = nextUrl.pathname; // Assign the requested path to a variable


 

  const isLoggedIn = !!req.auth;
  const user = await currentUser();
  const userRole = user?.role?.toLowerCase() || "";

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Allow API auth routes without restriction
  if (isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${userRole}`, nextUrl)); // Redirect logged-in user to their role-specific page
    }
    return;
  }

  // Redirect unauthenticated users to login if the route is not public
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // Handle role-based access control for logged-in users
  if (isLoggedIn) {
  const sortedRouteAccessMap = Object.entries(routeAccessMap).sort(
    ([patternA], [patternB]) => patternB.length - patternA.length // Sort by pattern length
  );

  for (const [routePattern, allowedRoles] of sortedRouteAccessMap) {
    

    const regex = new RegExp(`^${routePattern}$`); // Add anchors to make the match strict

    if (regex.test(nextUrl.pathname)) {
      

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL(`/${userRole}`, nextUrl));
      }
      break; // Stop once a match is found
    }
  }
}


  return; // Allow the request to proceed if it passes all checks
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};