// src/app/dashboard/organization/guide/[id]/page.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getGuideById,
  resetStatus,
  unassignGuideFromTour,
} from "@/lib/store/organization/guide/guide-slice";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  User,
  Shield,
  MapPinned,
  Clock,
  Edit3,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";

export default function GuideDetail() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;
  const dispatch = useAppDispatch();
  const { currentGuide, status, error } = useAppSelector(
    (store) => store.organizationGuide
  );
  const [isUnassigning, setIsUnassigning] = useState(false);

  useEffect(() => {
    if (guideId) {
      dispatch(resetStatus());
      dispatch(getGuideById(guideId));
    }
  }, [dispatch, guideId]);

  useEffect(() => {
    if (isUnassigning) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Guide unassigned from tour successfully",
          style: { background: "#008000", color: "white" },
        });
        setIsUnassigning(false);
        dispatch(getGuideById(guideId));
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to unassign guide",
          style: { background: "#800000", color: "white" },
        });
        setIsUnassigning(false);
      }
    }
  }, [status, error, isUnassigning, dispatch, guideId]);

  const handleUnassignTour = () => {
    if (
      confirm("Are you sure you want to unassign this guide from the tour?")
    ) {
      setIsUnassigning(true);
      dispatch(unassignGuideFromTour(guideId));
    }
  };

  const handleEditGuide = () => {
    router.push(`/dashboard/organization/guide/edit/${guideId}`);
  };

  if (status === Status.LOADING && !currentGuide) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentGuide) {
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Guide not found</p>
          <button
            onClick={() => router.push("/dashboard/organization/guide")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Guides
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "suspended":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/guide")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 cursor-pointer transition"
        >
          <ArrowLeft size={20} /> Back to Guides
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentGuide.guideName}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(
                  currentGuide.guideStatus
                )}`}
              >
                {currentGuide.guideStatus?.toUpperCase() || "ACTIVE"}
              </span>
              {currentGuide.tourId && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border-2 border-blue-300">
                  ASSIGNED
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleEditGuide}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Edit3 size={18} />
            Edit Guide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start gap-6">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-200 flex-shrink-0">
                <Image
                  src={
                    typeof currentGuide.guideImage === "string" &&
                    currentGuide.guideImage
                      ? currentGuide.guideImage
                      : "https://imgs.search.brave.com/-Q4gc0dPWnhnl8AHIbgIZb8k0-WNm52-G2dG2EdNhw4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8y/Ni8zOS9wcm9maWxl/LXBsYWNlaG9sZGVy/LWltYWdlLWdyYXkt/c2lsaG91ZXR0ZS12/ZWN0b3ItMjIxMjI2/MzkuanBn"
                  }
                  alt={currentGuide.guideName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        {currentGuide.guideName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {currentGuide.guideStatus || "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="text-blue-600" size={24} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-blue-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800 truncate">
                    {currentGuide.guideEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">
                    {currentGuide.guidePhoneNumber}
                  </p>
                </div>
              </div>

              {currentGuide.guideAddress && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {currentGuide.guideAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Tour Information */}
          {currentGuide.tourId &&
          (currentGuide.tourTitle || currentGuide.assignedTourTitle) ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={24} />
                  Assigned Tour
                </h2>
                <button
                  onClick={handleUnassignTour}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <XCircle size={18} />
                  Unassign
                </button>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {currentGuide.tourTitle || currentGuide.assignedTourTitle}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentGuide.tourStartDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-blue-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-700">
                          {new Date(
                            currentGuide.tourStartDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentGuide.tourEndDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-blue-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="font-medium text-gray-700">
                          {new Date(
                            currentGuide.tourEndDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentGuide.tourDuration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-blue-600" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium text-gray-700">
                          {currentGuide.tourDuration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {currentGuide.tourStatus && (
                  <div className="mt-3 pt-3 border-t">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        currentGuide.tourStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Tour Status: {currentGuide.tourStatus.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-xl shadow-lg border border-yellow-200 p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="text-yellow-600" size={24} />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Not Assigned to Any Tour
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    This guide is currently available for tour assignment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side (1/3) */}
        <div className="space-y-6">
          {/* Employment Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Employment Details
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Joined Date</p>
                <p className="font-semibold text-gray-800">
                  {currentGuide.guideJoinedDate
                    ? new Date(currentGuide.guideJoinedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              {currentGuide.guideSalary && (
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="text-green-600" size={18} />
                    <p className="text-xs text-green-700 font-medium">
                      Monthly Salary
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    ${currentGuide.guideSalary.toLocaleString()}
                  </p>
                </div>
              )}

              {currentGuide.createdAt && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Profile Created</p>
                  <p className="font-medium text-gray-800 text-sm">
                    {new Date(currentGuide.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
          </h2>
            <div className="space-y-2">
              <button
                onClick={handleEditGuide}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Edit Guide Profile
              </button>
              {currentGuide.tourId && (
                <button
                  onClick={handleUnassignTour}
                  className="w-full bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition font-medium border border-red-200"
                >
                  Unassign from Tour
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/organization/guide")}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Back to All Guides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
