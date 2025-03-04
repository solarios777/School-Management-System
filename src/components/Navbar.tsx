"use client";
import Image from "next/image";
import { UserButton } from "./auth/user-button";
import  Menu  from "@/components/Menu";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

const Navbar = ({ user }:any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = user?.role?.toLowerCase();
  const username = user?.name;

  return (
    <div className="flex  fixed top-0 left-0 right-0 z-50 items-center justify-between p-4 bg-gray-100">
      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-500 focus:outline-none"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

     

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{username}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
        <UserButton />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 overflow-y-auto">
            <div className="p-4">
              <Menu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;