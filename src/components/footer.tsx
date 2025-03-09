"use client"; // Add this if you're using interactivity (e.g., dynamic year)

import React from "react";
import Link from "next/link";
import { FaLinkedin, FaTelegram, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="bg-blue-400 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="https://www.linkedin.com/in/solomon-sala-b86577323"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaLinkedin className="w-6 h-6" />
          </Link>
          <Link
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FaTelegram className="w-6 h-6" />
          </Link>
          <Link
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            <FaYoutube className="w-6 h-6" />
          </Link>
          <Link
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            <FaTiktok className="w-6 h-6" />
          </Link>
        </div>

        {/* Copyright and Year */}
        <div className="text-center text-sm text-gray-900">
          &copy; {currentYear} Meki Catholic School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;