"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { resetStatus } from "@/lib/store/organization/tour/tour-slice";
import { ArrowLeft, Edit3 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function Tour() {
  /////////////////////////////
  /////HOOKS and SELECTOR/////
  ///////////////////////////
  const params = useParams();
  const router = useRouter();
  const tourId = params.id as string;

  const dispatch = useAppDispatch();
  const { tour, status, error } = useAppSelector(
    (store) => store.organizationTour
  );

  const selectedTour = tour.find((t) => t.tourId === tourId) || tour[0];

  ////////////////////////////
  //////Handler Funtion//////
  //////////////////////////

  const handleEditTour = (tourId?: string) => {
    if (tourId) {
      dispatch(resetStatus());
      router.push(`/dashboard/organization/tour/edit/${tourId}`);
    }
  };

  if (error || !selectedTour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">Tour Not Found</div>
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Back to Tours
        </button>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Tours
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tour Details</h1>
          <button
            onClick={() =>
              router.push(`/dashboard/organization/tour/edit/${tourId}`)
            }
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <Edit3 size={18} />
            Edit Tour
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Section - Info */}
          <div className="space-y-3 text-gray-900">
            <p>
              <span className="font-semibold text-gray-700">Tour Title:</span>{" "}
              {selectedTour.tourTitle}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Tour Description:
              </span>{" "}
              <span className="block text-gray-700 ml-2">
                {selectedTour.tourDescription}
              </span>
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Tour Number of People:
              </span>{" "}
              {selectedTour.tourNumberOfPeople}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Tour Price:</span>{" "}
              Rs. {selectedTour.tourPrice}
            </p>

            <p>
              <span className="font-semibold text-gray-700">
                Tour Duration:
              </span>{" "}
              {`${selectedTour.tourDuration} days`}
            </p>

            {/* Dates */}
            <div className="flex gap-6">
              <p>
                <span className="font-semibold text-gray-700">
                  Tour Start Date:
                </span>{" "}
                {selectedTour.tourStartDate}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Tour End Date:
                </span>{" "}
                {selectedTour.tourEndDate}
              </p>
            </div>

            {/* Categories */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Categories:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTour?.categories?.map((cat) => (
                  <span
                    key={cat.categoryId}
                    className="px-3 py-1 border border-gray-400 text-gray-600 rounded-full text-sm bg-gray-50"
                  >
                    {cat.categoryName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="border border-gray-200 overflow-hidden shadow-sm">
              <Image
                src={
                  typeof selectedTour?.tourPhoto === "string"
                    ? selectedTour.tourPhoto
                    : "/static/images/placeholder.jpg"
                }
                alt={selectedTour.tourTitle}
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
