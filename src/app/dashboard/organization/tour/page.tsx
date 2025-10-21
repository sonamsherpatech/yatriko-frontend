"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteTour,
  getTours,
  resetStatus,
} from "@/lib/store/organization/tour/tour-slice";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function organizationTour() {
  const router = useRouter();
  const {
    error,
    status,
    tour: tours,
  } = useAppSelector((store) => store.organizationTour);
  const dispatch = useAppDispatch();
  const isDeleting = useRef(false);

  const [tourQuery, setTourQuery] = useState<string>("");

  const handleCreateTour = () => {
    dispatch(resetStatus());
    router.push("/dashboard/organization/tour/create");
  };

  const handleEditTour = (tourId?: string) => {
    if (tourId) {
      dispatch(resetStatus());
      router.push(`/dashboard/organization/tour/edit/${tourId}`);
    }
  };

  const handleDeleteTour = (tourId?: string) => {
    if (tourId) {
      isDeleting.current = true;
      dispatch(deleteTour(tourId));
      dispatch(resetStatus());
    }
  };

  useEffect(() => {
    dispatch(getTours());
    dispatch(resetStatus());
  }, []);

  useEffect(() => {
    if (isDeleting.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Deleted tour sucessfully",
          style: {
            color: "white",
            background: "#008000",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to delete tour",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      }
    }
  }, [status, error]);

  const filteredData = tours?.filter((tour) =>
    tour.tourTitle.toString().toLowerCase().includes(tourQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Tours</h1>
          <button
            onClick={handleCreateTour}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Add Tour <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="SearchTour"
            onChange={(e) => setTourQuery(e.target.value)}
            value={tourQuery}
            placeholder="Search Tour"
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className=" text-gray-700 text-left">
                <th className="px-4 py-3 border-b">Title</th>
                <th className="px-4 py-3 border-b">No of People</th>
                <th className="px-4 py-3 border-b">Price</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((tour) => (
                  <tr key={tour.tourId} className=" transition-colors border-b">
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {tour.tourTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tour.tourNumberOfPeople}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tour.tourPrice}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-medium ${
                        tour.tourStatus === "active"
                          ? " text-green-700"
                          : tour.tourStatus === "inactive"
                          ? " text-gray-600"
                          : tour.tourStatus === "cancelled"
                          ? " text-red-700"
                          : " text-yellow-700"
                      }`}
                    >
                      {tour.tourStatus}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3 text-gray-600">
                      <button
                        onClick={() => handleEditTour(tour.tourId)}
                        title="Edit"
                        className="hover:text-blue-600 cursor-pointer transition"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour.tourId)}
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
                    No Tours found.
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
