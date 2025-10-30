"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Status } from "@/lib/types";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

const selectedTour = [
  {
    id: "125",
    tourName: "Pashupati",
  },
];

export default function CreateGuide() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status: TourStatus, tour } = useAppSelector(
    (store) => store.organizationTour
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Create Guide
        </h2>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
        >
          <span className="text-lg font-bold">{<ArrowLeft size={18} />}</span>
          Back to guide
        </button>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            name="guideName"
            placeholder="Enter Guide name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            type="text"
            name="guideEmail"
            placeholder="Enter guide email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="guidePhoneNumber"
              placeholder="+977 98*********"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              name="guideAddress"
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
                name="guidePhoto"
                className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Salary
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="guideSalary"
              placeholder="e.g 45000"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          {TourStatus === Status.LOADING ? (
            <p className="text-gray-500 text-sm">Loading tours...</p>
          ) : (
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ">
              <option value="">Select Tour</option>
              {tour.map((t: any) => (
                <option key={t.tourId} value={t.tourId}>
                  {t.tourTitle}{" "}
                </option>
              ))}
            </select>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedTour.map((t) => (
              <span
                key={t.id}
                className="flex items-center gap-1 bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {t.tourName}
                <X className="w-4 h-4 cursor-pointer hover:text-red-500" />
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Create Guide
        </button>
      </form>
    </div>
  );
}
