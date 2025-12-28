"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getGuideById } from "@/lib/store/organization/guide/guide-slice";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Guide() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;
  const dispatch = useAppDispatch();
  const { currentGuide } = useAppSelector((store) => store.organizationGuide);
  console.log(currentGuide);

  useEffect(() => {
    if (guideId) {
      dispatch(getGuideById(guideId));
    }
  }, [dispatch, guideId]);

  if(!currentGuide) {
    return (
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Guide not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/guide")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Guides
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{currentGuide.guideName.split(" ")[0]}'s Details</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Section - Info */}
          <div className="space-y-3 text-gray-900">
            <p>
              <span className="font-semibold text-gray-700">Guide Name: </span>{" "}
              {currentGuide.guideName}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Tour Email:</span>{" "}
              <span className="block text-gray-700 ml-2">
                {currentGuide.guideEmail}
              </span>
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Guide Address:{" "}
              </span>{" "}
              {currentGuide.guideAddress}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Guide Phone Number:
              </span>{" "}
              {currentGuide.guidePhoneNumber}
            </p>

            <p>
              <span className="font-semibold text-gray-700">JoinedDate:</span>{" "}
              {new Date(currentGuide?.guideJoinedDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>

            {/* Dates */}
            <div className="flex gap-6">
              <p>
                <span className="font-semibold text-gray-700">
                  Guide Salary:
                </span>{" "}
                Rs. {currentGuide.guideSalary}
              </p>
            </div>

            {/* Categories */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Tour:</p>
              <div className="flex flex-wrap gap-2">
                {currentGuide.tourTitle}
              </div>
            </div>
          </div>

          {/* Right Section - Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="border border-gray-200 overflow-hidden shadow-sm">
              <Image
                src={
                  typeof currentGuide?.guideImage === "string"
                    ? currentGuide.guideImage
                    : "/static/images/placeholder.jpg"
                }
                alt={currentGuide.guideName + "image"}
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
