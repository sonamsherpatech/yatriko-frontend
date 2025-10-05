"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/auth/auth-slice";

export default function NavBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  console.log(isAuthenticated, "AUthenticated checking....");
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-8 shadow-md bg-white">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image
            src="/static/images/logo_yatriko.png"
            width={120}
            height={120}
            alt="Logo"
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/about-us" className="hover:text-blue-600">
          About Us
        </Link>
        <Link href="/services" className="hover:text-blue-600">
          Services
        </Link>
        <Link href="/contact-us" className="hover:text-blue-600">
          Contact
        </Link>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => router.push("/dashboard/tourist")}
              className="px-4 py-1 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >
              My Dashboard
            </button>
            <button
              onClick={() => router.push("/create-organization")}
              className="px-4 py-1 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >
              Create Organization
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
