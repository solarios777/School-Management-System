// 

import authConfig from "../auth.config"
import NextAuth from "next-auth"
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes, 
  DEFAULT_LOGIN_REDIRECT
} from "../routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const {nextUrl}=req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return 
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return 
  }
  
  if(!isLoggedIn && !isPublicRoute){
    return Response.redirect(new URL("/auth/login", nextUrl))
  } 

  return 
  
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
