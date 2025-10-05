"use client";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ILoginType } from "./login-type";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { loginUser,  setReset } from "@/lib/store/auth/auth-slice";
import { Status } from "@/lib/types";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toastify/toastify";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [data, setData] = useState<ILoginType>({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(setReset());
  }, [dispatch]);

  useEffect(() => {
    if (status === Status.SUCCESS && isAuthenticated) {
      // Sucessfull Toast Message
      showToast({
        text: "Login Successful!",
        style: { background: "#008000", color: "white" },
      });
      router.push("/");
    } else if (status === Status.ERROR) {
      showToast({
        text: error || "Login Failed",
        style: { background: "#800000", color: "white" },
      });
    }
  }, [status, isAuthenticated, error, router]);

  function handleLoginDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleLoginSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(loginUser(data));
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full flex items-center justify-center">
        <div className="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Login</h2>
          <form onSubmit={handleLoginSubmission}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleLoginDataChange}
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleLoginDataChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <a href="http://localhost:3000/auth/google">
            <button className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
              <Image
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5 mr-2"
              />
              Sign-in with Google
            </button>
          </a>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
