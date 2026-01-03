// src/app/dashboard/organization/guide/page.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteGuide,
  getGuides,
  resetStatus,
  updateGuideStatusById,
} from "@/lib/store/organization/guide/guide-slice";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";
import {
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  UserCog,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type GuideStatus = "active" | "inactive" | "suspended";

export default function OrganizationGuide() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    guide: guides,
    stats,
    status,
    error,
  } = useAppSelector((store) => store.organizationGuide);

  const isGuideDeleting = useRef<boolean>(false);
  const isStatusUpdating = useRef<boolean>(false);

  const [guideQuery, setGuideQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(getGuides());
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isGuideDeleting.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Guide deleted successfully",
          style: {
            color: "white",
            background: "#008000",
          },
        });
        isGuideDeleting.current = false;
        dispatch(resetStatus());
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to delete guide",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        isGuideDeleting.current = false;
        dispatch(resetStatus());
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
        dispatch(resetStatus());
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to update guide status",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        isStatusUpdating.current = false;
        dispatch(resetStatus());
      }
    }
  }, [status, error, dispatch]);

  function handleCreateGuide() {
    dispatch(resetStatus());
    router.push("/dashboard/organization/guide/create");
  }

  function handleDeleteGuide(id?: string, guideName?: string) {
    if (id && confirm(`Are you sure you want to delete ${guideName}?`)) {
      dispatch(deleteGuide(id));
      isGuideDeleting.current = true;
    }
  }

  function handleGuideDetail(id?: string) {
    if (id) {
      dispatch(resetStatus());
      router.push(`/dashboard/organization/guide/${id}`);
    }
  }

  function handleStatusChange(newStatus: GuideStatus, id?: string) {
    if (id) {
      dispatch(updateGuideStatusById(newStatus, id));
      isStatusUpdating.current = true;
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  const filteredData = guides.filter((guide) => {
    const matchesSearch = guide.guideName
      .toLowerCase()
      .includes(guideQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || guide.guideStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === Status.LOADING && guides.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tour Guides</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your organization's tour guides
            </p>
          </div>
          <button
            onClick={handleCreateGuide}
            className="bg-blue-600 cursor-pointer text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <span className="text-lg font-bold">+</span>
            Add Guide
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <p className="text-sm text-blue-700 font-medium">Total</p>
            </div>
            <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="text-green-600" size={20} />
              <p className="text-sm text-green-700 font-medium">Active</p>
            </div>
            <p className="text-2xl font-bold text-green-800">{stats.active}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-700 font-medium">Inactive</p>
            </div>
            <p className="text-2xl font-bold text-yellow-800">
              {stats.inactive}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <UserCog className="text-red-600" size={20} />
              <p className="text-sm text-red-700 font-medium">Suspended</p>
            </div>
            <p className="text-2xl font-bold text-red-800">{stats.suspended}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="text-purple-600" size={20} />
              <p className="text-sm text-purple-700 font-medium">Assigned</p>
            </div>
            <p className="text-2xl font-bold text-purple-800">
              {stats.assigned}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-indigo-600" size={20} />
              <p className="text-sm text-indigo-700 font-medium">Available</p>
            </div>
            <p className="text-2xl font-bold text-indigo-800">
              {stats.available}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={guideQuery}
              onChange={(e) => setGuideQuery(e.target.value)}
              placeholder="Search guides by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Guides Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-700 text-left bg-gray-50">
                <th className="px-4 py-3 border-b font-semibold">Guide</th>
                <th className="px-4 py-3 border-b font-semibold">Contact</th>
                <th className="px-4 py-3 border-b font-semibold">
                  Joined Date
                </th>
                <th className="px-4 py-3 border-b font-semibold">
                  Assigned Tour
                </th>
                <th className="px-4 py-3 border-b font-semibold">Status</th>
                <th className="px-4 py-3 border-b font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((guide) => (
                  <tr
                    key={guide.id}
                    className="hover:bg-gray-50 transition-colors border-b"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={
                              typeof guide.guideImage === "string" &&
                              guide.guideImage
                                ? guide.guideImage
                                : "https://imgs.search.brave.com/-Q4gc0dPWnhnl8AHIbgIZb8k0-WNm52-G2dG2EdNhw4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8y/Ni8zOS9wcm9maWxl/LXBsYWNlaG9sZGVy/LWltYWdlLWdyYXkt/c2lsaG91ZXR0ZS12/ZWN0b3ItMjIxMjI2/MzkuanBn"
                            }
                            alt={guide.guideName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {guide.guideName}
                          </p>
                          {guide.guideSalary && (
                            <p className="text-xs text-gray-500">
                              Salary: ${guide.guideSalary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-800">
                        {guide.guideEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {guide.guidePhoneNumber}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">
                      {guide.guideJoinedDate &&
                        new Date(guide.guideJoinedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                    </td>
                    <td className="px-4 py-4">
                      {guide.assignedTourTitle || guide.tourTitle ? (
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {guide.assignedTourTitle || guide.tourTitle}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={guide.guideStatus || "active"}
                        onChange={(e) =>
                          handleStatusChange(
                            e.target.value as GuideStatus,
                            guide.id
                          )
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
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          title="View Details"
                          onClick={() => handleGuideDetail(guide.id)}
                          className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() =>
                            handleDeleteGuide(guide.id, guide.guideName)
                          }
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">
                    {guideQuery || statusFilter !== "all"
                      ? "No guides match your search criteria"
                      : "No guides found. Create your first guide to get started."}
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
