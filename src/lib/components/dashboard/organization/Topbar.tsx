"use client";
import { User } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between bg-white  px-8 py-4 border-b border-gray-200 shadow-sm">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition"
        >
          <User size={18} />
          Profile
        </Link>
        <Link
          href="/"
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          Back to Homepage
        </Link>
      </div>
    </header>
  );
}
