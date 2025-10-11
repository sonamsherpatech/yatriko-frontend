"use client";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const filteredData = [
  {
    id: "123",
    tourName: "Everest Base Camp",
    tourNoOfPeople: "45",
    tourPrice: "45000",
    tourStatus: "active",
  },
];

export default function organizationTour() {
  const router = useRouter();
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Tours</h1>
          <button
            onClick={() => router.push("/dashboard/organization/tour/create")}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Add Tour <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="SearchTour"
            placeholder="Search Tour"
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className=" text-gray-700 text-left">
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">No of People</th>
                <th className="px-4 py-3 border-b">Price</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(
                  (cat: {
                    id: string;
                    tourName: string;
                    tourNoOfPeople: string;
                    tourPrice: string;
                    tourStatus: string;
                  }) => (
                    <tr key={cat.id} className=" transition-colors border-b">
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {cat.tourName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {cat.tourNoOfPeople}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {cat.tourPrice}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {cat.tourStatus}
                      </td>
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
                  )
                )
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No Categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
