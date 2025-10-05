"use client";
import { useState } from "react";

export default function CreateOrganization() {
  const [orgType, setOrgType] = useState<string>("");
  return (
    <div className="p-8 flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Organization
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          <em>Build your presence on our tourism platform.</em>
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Organization Name
            </label>
            <input
              type="text"
              placeholder="Enter organization name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Organization Registration Number
            </label>
            <select
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setOrgType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="pan">PAN Number</option>
              <option value="vat">VAT Number</option>
            </select>
          </div>

          {orgType && (
            <div
              className="transition-all duration-300"
              style={{ marginTop: "0.5rem" }}
            >
              <label className="block text-gray-700 text-sm mb-1">
                {orgType.toUpperCase()} Number
              </label>
              <input
                type="text"
                name="panOrVat"
                placeholder={`Enter ${orgType.toUpperCase()} number`}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
}
