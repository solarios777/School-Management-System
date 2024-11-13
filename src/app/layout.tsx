import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCS",
  description: "Next.js School Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          {children} <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </SessionProvider>
  );
}
