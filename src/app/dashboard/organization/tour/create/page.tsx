"use client";
import { ArrowLeft, Calendar, Image, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { IOrganizationTourType } from "./organization-tour-types";
import schema from "./organization-tour-validation";
import { useRouter } from "next/navigation";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

const selectedCategories = ["Adventure", "Trek"];

export default function CreateTour() {
  const router = useRouter();
  const [data, setData] = useState<IOrganizationTourType>({
    tourName: "",
    tourDescription: "",
    tourNoOfPeople: "",
    tourPrice: "",
    tourDuration: "",
    tourPhoto: "",
    tourEndDate: "",
    tourStartDate: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  function handleTourDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleTourDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Create Tour
        </h2>
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
        >
          <span className="text-lg font-bold">{<ArrowLeft size={18} />}</span>
          Back to tour
        </button>
      </div>

      <form onSubmit={handleTourDataSubmission} className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            name="tourName"
            onChange={handleTourDataChange}
            placeholder="Enter tour name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.tourName && (
            <p style={errorStyle}>{errors.tourName._errors[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Write a short description..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              No of People
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              placeholder="e.g. 2000"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 5 days"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Start Date
            </label>
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
              <Calendar className="text-gray-500" />
              <input type="date" className="w-full text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              End Date
            </label>
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
              <Calendar className="text-gray-500" />
              <input type="date" className="w-full text-sm outline-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          <select
            // onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Category</option>
            <option value="Category_1">Category_1</option>
            <option value="Category_2">Category_2</option>
          </select>

          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {cat}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                  //   onClick={() => handleRemoveCategory(cat)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Create Tour
        </button>
      </form>
    </div>
  );
}
