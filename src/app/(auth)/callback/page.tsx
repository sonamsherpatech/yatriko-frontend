"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { showToast } from "@/lib/toastify/toastify";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);

      showToast({
        text: "Login Successful!",
        style: { background: "#008000", color: "white" },
      });

      router.push("/");
    } else if (error) {
      showToast({
        text: "Google Authentication Failed",
        style: { background: "#800000", color: "white" },
      });
      router.push("/auth/login");
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
}
