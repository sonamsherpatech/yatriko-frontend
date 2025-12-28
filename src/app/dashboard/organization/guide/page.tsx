"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteGuide,
  getGuideById,
  getGuides,
  resetStatus,
  updateGuideStatusById,
} from "@/lib/store/organization/guide/guide-slice";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OrganizationGuide() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    guide: guides,
    status,
    error,
  } = useAppSelector((store) => store.organizationGuide);
  const isGuideDeleting = useRef<boolean>(false);
  const isStatusUpdating = useRef<boolean>(false);

  /////////////////////////
  /////USE State/////////
  ///////////////////////
  const [guideQuery, setGuideQuery] = useState<string>("");

  /////////////////////////
  /////USE Effect/////////
  ///////////////////////
  useEffect(() => {
    dispatch(getGuides());
    dispatch(resetStatus());
  }, []);

  useEffect(() => {
    if (isGuideDeleting.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Guide deleted Successfully",
          style: {
            color: "white",
            background: "#008000",
          },
        });
        isGuideDeleting.current = false;
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to delete guide",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        isGuideDeleting.current = false;
      }
    }

    if (isStatusUpdating.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Guide status updated successfully",
          style: {
            color: "white",
            background: "#008000",
          },
        });
        isStatusUpdating.current = false;
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to update guide status",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        isStatusUpdating.current = false;
      }
    }
  }, [status, error]);

  //////////////////////
  ////Functions////////
  ////////////////////
  function handleCreateGuide() {
    dispatch(resetStatus());
    router.push("/dashboard/organization/guide/create");
  }

  function handleDeleteGuide(id?: string) {
    if (id) {
      dispatch(deleteGuide(id));
      dispatch(resetStatus());
      isGuideDeleting.current = true;
    }
  }

  function handleGuideDetail(id?: string) {
    if (id) {
      dispatch(getGuideById(id));
      router.push(`/dashboard/organization/guide/${id}`);
      dispatch(resetStatus());
    }
  }

  function handleStatusChange(newStatus: string, id?: string) {
    if (id) {
      dispatch(updateGuideStatusById(newStatus, id));
      dispatch(resetStatus());
      isStatusUpdating.current = true;
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
        break;
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
        break;
      case "suspended":
        return "bg-red-100 text-red-800 border-red-300";
        break;
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  const filteredData = guides.filter((guide) =>
    guide.guideName.toString().toLowerCase().includes(guideQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Create Guide</h1>
          <button
            onClick={handleCreateGuide}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Add Guide <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="SearchCategory"
            onChange={(e) => setGuideQuery(e.target.value)}
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
                filteredData.map((guide) => (
                  <tr key={guide.id} className=" transition-colors border-b">
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {guide.guideName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {guide.guideEmail}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {guide.guideJoinedDate &&
                        new Date(
                          guide.guideJoinedDate.toString()
                        ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={guide.guideStatus || "active"}
                        onChange={(e) =>
                          handleStatusChange(e.target.value, guide.id)
                        }
                        className={`px-3 py-1 rounded-lg border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(
                          guide.guideStatus
                        )}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3 text-gray-600">
                      {/* <button
                        title="Edit"
                        className="hover:text-blue-600 cursor-pointer transition"
                      >
                        <Edit3 size={18} />
                      </button> */}
                      <button
                        title="Delete"
                        onClick={() => handleDeleteGuide(guide?.id)}
                        className="hover:text-red-600 cursor-pointer transition"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        title="Select"
                        onClick={() => handleGuideDetail(guide.id)}
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
                    No Guides found.
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
