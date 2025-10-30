"use client";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const filteredData = [
  {
    id: "45",
    guideName: "Sonamm Sherpa",
    guideEmail: "sonammzyou@gmail.com",
    guideStatus: "active",
    guideJoinedDate: "2022-08-12",
  },
];

export default function OrganizationGuide() {
  const router = useRouter();
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Create Guide</h1>
          <button
            onClick={() => router.push("/dashboard/organization/guide/create")}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Add Guide <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="SearchCategory"
            placeholder="Search Guide"
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className=" text-gray-700 text-left">
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Joined Date</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((g) => (
                  <tr key={g.id} className=" transition-colors border-b">
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {g.guideName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{g.guideEmail}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(
                        g.guideJoinedDate.toString()
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{g.guideStatus}</td>
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
                ))
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
