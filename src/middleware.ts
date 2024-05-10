import { clerkMiddleware } from "@clerk/nextjs/server";
// this does not protect any route by default
export default clerkMiddleware({});
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
