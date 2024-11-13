"use client";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    
    DropdownMenuTrigger

 } from "../ui/dropdown-menu"; 
import { 
    Avatar,
    AvatarFallback,
    AvatarImage 
} from "../ui/avatar";

import { FaUser } from "react-icons/fa";
import { LogOutButton } from "./logOut-button";

export const UserButton = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{<FaUser />}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
                <DropdownMenuItem className="cursor-pointer">
                    Profile
                </DropdownMenuItem>
                <LogOutButton >
                    Logout
                </LogOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
