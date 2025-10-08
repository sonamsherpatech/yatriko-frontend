"use client";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useState } from "react";

export default function OrganizationTourCategory() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      categoryName: "Adventure",
      categoryDescription:
        "Exciting tours for thrill-seekers and explorers that will.",
      createdAt: "2025-10-08",
    },
  ]);

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Create Category
          </h1>
          <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            Add Category <span className="text-lg font-bold">+</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Category"
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className=" text-gray-700 text-left">
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">Category Name</th>
                <th className="px-4 py-3 border-b">Category Description</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className=" transition-colors border-b">
                  <td className="px-4 py-3 text-gray-700">{cat.id}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {cat.categoryName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cat.categoryDescription.length > 50
                      ? cat.categoryDescription.substring(0, 50) + "..."
                      : cat.categoryDescription}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cat.createdAt}</td>
                  <td className="px-4 py-3 flex justify-center gap-3 text-gray-600">
                    <button
                      title="Edit"
                      className="hover:text-blue-600 cursor-pointer transition"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      title="Delete"
                      className="hover:text-red-600 cursor-pointer transition"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      title="Select"
                      className="hover:text-green-600 cursor-pointer transition"
                    >
                      <MousePointerSquareDashed size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
