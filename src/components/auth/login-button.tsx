"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({ children, mode = "redirect", asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: add login modal</span>;
  }

  // If asChild is true, render children directly without a button wrapper
  return (
    <>
      {asChild ? (
        React.cloneElement(children as React.ReactElement, { onClick }) // Pass onClick to the child button
      ) : (
        <button onClick={onClick} className="your-button-class">
          {children}
        </button>
      )}
    </>
  );
};