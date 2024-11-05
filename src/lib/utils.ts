// import { auth } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export const getUserInfo = async () => {
//   const { sessionClaims, userId } = await auth();
  
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   const currentUserId = userId || null; // Default to null if userId is undefined
  
//   return {
//     role,
//     currentUserId
//   };
// }

