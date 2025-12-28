"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createGuide,
  getGuides,
  resetStatus,
} from "@/lib/store/organization/guide/guide-slice";
import { IOrganizationGuide } from "@/lib/store/organization/guide/guide-slice-types";
import { IOrganizationTourType } from "@/lib/store/organization/tour/tour-slice-types";
import { Status } from "@/lib/types";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import schema from "./organization-guide-validation";
import { getTours } from "@/lib/store/organization/tour/tour-slice";
import { showToast } from "@/lib/toastify/toastify";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function CreateGuide() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status: TourStatus, tour } = useAppSelector(
    (store) => store.organizationTour
  );
  const { status: GuideStatus, error } = useAppSelector(
    (store) => store.organizationGuide
  );

  //////////////////////////////
  ////////////State////////////
  ////////////////////////////
  const [selectedTour, setSelectedTour] =
    useState<IOrganizationTourType | null>(null);

  const [guideData, setGuideData] = useState<IOrganizationGuide>({
    guideName: "",
    guideEmail: "",
    guideAddress: "",
    guidePhoneNumber: "",
    guideImage: "",
    guideJoinedDate: "",
    guideSalary: 0,
    tourId: "",
    createdAt: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  //////////////////////////////
  ////UseEffect Function///////
  ////////////////////////////

  useEffect(() => {
    if (!tour.length) {
      dispatch(getTours());
    }
  }, [dispatch, tour.length]);

  useEffect(() => {
    if (GuideStatus === Status.SUCCESS) {
      showToast({
        text: "Guide Created Sucessfully",
        style: {
          color: "white",
          background: "#008000",
        },
      });
      dispatch(resetStatus());
      router.push("/dashboard/organization/guide");
    } else if (GuideStatus === Status.ERROR) {
      showToast({
        text: error || "Failed to create guide",
        style: {
          color: "white",
          background: "#800000",
        },
      });
    }
  }, [GuideStatus, error, dispatch]);

  //////////////////////////////
  ////Handle Functions/////////
  ////////////////////////////
  function handleGuideDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGuideData({
      ...guideData,
      [name]: value,
    });
  }

  function handleTourSelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedTourId = e.target.value;
    if (!selectedTourId) return;
    const selectedTo = tour.find((t: any) => t.tourId === selectedTourId);
    if (!selectedTo) return;

    setSelectedTour(selectedTo);
    if (selectedTo?.tourId) {
      setGuideData({ ...guideData, tourId: selectedTo?.tourId });
    }
    e.target.value = "";
  }

  function handleTourRemove() {
    setSelectedTour(null);
    setGuideData({ ...guideData, tourId: "" });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      setGuideData({
        ...guideData,
        guideImage: file,
      });
    }
  }

  function handleGuideDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(guideData);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
      dispatch(createGuide(guideData));
    }
  }

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

      <form onSubmit={handleGuideDataSubmission} className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            name="guideName"
            onChange={handleGuideDataChange}
            placeholder="Enter Guide name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.guideName && (
            <p style={errorStyle}>{errors.guideName._errors[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            type="text"
            name="guideEmail"
            onChange={handleGuideDataChange}
            placeholder="Enter guide email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.guideEmail && (
            <p style={errorStyle}>{errors.guideEmail._errors[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="guidePhoneNumber"
              onChange={handleGuideDataChange}
              placeholder="+977 98*********"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.guidePhoneNumber && (
              <p style={errorStyle}>{errors.guidePhoneNumber._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              name="guideAddress"
              onChange={handleGuideDataChange}
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
                name="guideImage"
                onChange={handleFileChange}
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
              onChange={handleGuideDataChange}
              placeholder="e.g 45000"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.guideSalary && (
              <p style={errorStyle}>{errors.guideSalary._errors[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          {TourStatus === Status.LOADING ? (
            <p className="text-gray-500 text-sm">Loading tours...</p>
          ) : (
            <select
              name="tourId"
              onChange={handleTourSelect}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none "
            >
              <option value="">Select Tour</option>
              {tour.map((t: any) => (
                <option key={t.tourId} value={t.tourId}>
                  {t.tourTitle}{" "}
                </option>
              ))}
            </select>
          )}

          {selectedTour && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1 bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {selectedTour?.tourTitle}
                <button type="button" onClick={handleTourRemove}>
                  <X className="w-4 h-4 cursor-pointer hover:text-red-500" />
                </button>
              </span>
            </div>
          )}
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
