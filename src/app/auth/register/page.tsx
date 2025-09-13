"use client";
import Image from "next/image";
import coverSignupImage from "./../../../../public/static/images/tourism_singup_image.jpg";
import { ChangeEvent, FormEvent, useState } from "react";
import { IRegisterTypes } from "./register-type";
import { schema } from "./register-validation";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function Signup() {
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
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      //   console.log("Form Submitted!!!");
      setErrors({});
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 flex items-center justify-center border-r border-gray-200">
        <div className="w-3/4 h-3/4 flex items-center justify-center text-gray-500">
          <Image
            src={coverSignupImage}
            alt="Cover Singup Image"
            className="object-contain"
            width={500}
          />
        </div>
      </div>

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
          <button className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign-up with Google
          </button>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
