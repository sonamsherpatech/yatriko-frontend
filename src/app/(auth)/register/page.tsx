"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { IRegisterTypes } from "./register-type";
import { schema } from "./register-validation";
import { useAppDispatch } from "@/lib/store/hooks";
import { registerUser } from "@/lib/store/auth/auth-slice";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toastify/toastify";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [data, setData] = useState<IRegisterTypes>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  function handleRegisterDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleRegisterSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //Handle validation
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
      //After sucessful register redirect to login
      router.push("/login");

      // Sucessfull Toast Message
      showToast({
        text: "Registration Successful!",
        style: { background: "#008000", color: "white" },
      });
    }

    //API Call Method Invocation
    dispatch(registerUser(data));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Sign up</h2>
          <form onSubmit={handleRegisterSubmission}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleRegisterDataChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && (
                <p style={errorStyle}>{errors.username._errors[0]}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleRegisterDataChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p style={errorStyle}>{errors.email._errors[0]}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleRegisterDataChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p style={errorStyle}>{errors.password._errors[0]}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleRegisterDataChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p style={errorStyle}>{errors.confirmPassword._errors[0]}</p>
              )}
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Sign up
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
