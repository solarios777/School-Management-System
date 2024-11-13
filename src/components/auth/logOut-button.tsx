"use client"

import { signOut } from "next-auth/react";

interface LogOutButtonProps {
    children?: React.ReactNode;
}

export const LogOutButton = ({ children }: LogOutButtonProps) => {
    const onClick = () => {
        signOut()
    }
    return (
        <span onClick={onClick} className="cursor-pointer">{children}</span>
    )
}