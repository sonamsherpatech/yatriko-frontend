"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ArrowLeft, Edit3 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getOrganizationDetail } from "../../../../lib/store/organization/organization-slice";

export default function OrganizationProfile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organization, status, error } = useAppSelector(
    (store) => store.organization
  );

  useEffect(() => {
    dispatch(getOrganizationDetail());
  }, [dispatch]);

  const selectedOrganization = organization[0];

  if (status === "loading") {
    return (
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <p className="text-center py-8">Loading organization details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <p className="text-center py-8 text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!selectedOrganization) {
    return (
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <p className="text-center py-8">No organization found</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Details
          </h1>
          <button
            onClick={() => router.push(`/dashboard/organization/edit/`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Section - Info */}
          <div className="space-y-3 text-gray-900">
            <p>
              <span className="font-semibold text-gray-700">
                Organization Name:{" "}
              </span>
              {selectedOrganization.organizationName}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Organization Email:
              </span>{" "}
              {selectedOrganization.organizationEmail}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Organization Address:{" "}
              </span>
              {selectedOrganization.organizationAddress}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Organization Phone Number:
              </span>{" "}
              {selectedOrganization.organizationPhoneNumber}
            </p>

            <p>
              <span className="font-semibold text-gray-700">PAN No:</span>{" "}
              {selectedOrganization.organizationPanNo || "N/A"}
            </p>

            <p>
              <span className="font-semibold text-gray-700">VAT No:</span>{" "}
              {selectedOrganization.organizationVatNo || "N/A"}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Created At:</span>{" "}
              {new Date(selectedOrganization.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          {/* Right Section - Logo */}
          <div className="flex justify-center md:justify-end">
            <div className="border border-gray-200 overflow-hidden shadow-sm rounded-lg">
              <Image
                src={
                  typeof selectedOrganization.organizationLogo === "string"
                    ? selectedOrganization.organizationLogo
                    : "/static/images/placeholder.jpg"
                }
                alt={selectedOrganization.organizationName + " logo"}
                width={300}
                height={250}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
