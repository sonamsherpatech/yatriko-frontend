"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Layers, Users, User, Folder } from "lucide-react";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard/organization", icon: Home },
  { name: "Tour", href: "/dashboard/organization/tour", icon: Map },
  { name: "Category", href: "/dashboard/organization/category", icon: Layers },
  { name: "Tourist", href: "/dashboard/organization/tourist", icon: Users },
  { name: "Guide", href: "/dashboard/organization/guide", icon: Folder },
  { name: "Profile", href: "/dashboard/organization/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white shadow-lg border-r border-gray-100 w-64 min-h-screen flex flex-col">
      <div className="flex items-center justify-center py-6 border-b border-gray-100">
        <Image
          src="/static/images/logo_yatriko.png"
          alt="Company Logo"
          height={100}
          width={100}
        />
      </div>

      <nav className="flex flex-col p-4 gap-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all ${
              pathname === href ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`}
          >
            <Icon size={18} />
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
