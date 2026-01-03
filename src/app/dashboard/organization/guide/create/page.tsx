
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createGuide,
  resetStatus,
} from "@/lib/store/organization/guide/guide-slice";
import { IOrganizationGuide } from "@/lib/store/organization/guide/guide-slice-types";
import { Status } from "@/lib/types";
import {
  ArrowLeft,
  X,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import schema from "./organization-guide-validation";
import { getTours } from "@/lib/store/organization/tour/tour-slice";
import { showToast } from "@/lib/toastify/toastify";
import Image from "next/image";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function CreateGuide() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status: tourStatus, tour } = useAppSelector(
    (store) => store.organizationTour
  );
  const { status: guideStatus, error } = useAppSelector(
    (store) => store.organizationGuide
  );

  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [guideData, setGuideData] = useState<IOrganizationGuide>({
    guideName: "",
    guideEmail: "",
    guideAddress: "",
    guidePhoneNumber: "",
    guideImage: "",
    guideSalary: 0,
    tourId: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!tour.length) {
      dispatch(getTours());
    }
  }, [dispatch, tour.length]);

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (guideStatus === Status.SUCCESS) {
      showToast({
        text: "Guide created successfully",
        style: {
          color: "white",
          background: "#008000",
        },
      });
      dispatch(resetStatus());
      router.push("/dashboard/organization/guide");
    } else if (guideStatus === Status.ERROR) {
      showToast({
        text: error || "Failed to create guide",
        style: {
          color: "white",
          background: "#800000",
        },
      });
      dispatch(resetStatus());
    }
  }, [guideStatus, error, dispatch, router]);

  function handleGuideDataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGuideData({
      ...guideData,
      [name]: name === "guideSalary" ? parseFloat(value) || 0 : value,
    });
  }

  function handleTourSelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedTourId = e.target.value;
    if (!selectedTourId) return;

    const selectedT = tour.find((t: any) => t.tourId === selectedTourId);
    if (!selectedT) return;

    setSelectedTour(selectedT);
    setGuideData({ ...guideData, tourId: selectedT.tourId });
    e.target.value = "";
  }

  function handleTourRemove() {
    setSelectedTour(null);
    setGuideData({ ...guideData, tourId: "" });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }

      setGuideData({
        ...guideData,
        guideImage: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setGuideData({ ...guideData, guideImage: "" });
    setImagePreview(null);
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
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Guide</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a new guide profile for your organization
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer shadow-md"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After creating the guide, they will receive
              an email with their login credentials. Make sure to use a valid
              email address.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleGuideDataSubmission} className="space-y-6">
        {/* Personal Information Section */}
        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Personal Information
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="guideName"
                  value={guideData.guideName}
                  onChange={handleGuideDataChange}
                  placeholder="Enter guide's full name"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              {errors.guideName && (
                <p style={errorStyle}>{errors.guideName._errors[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="guideEmail"
                  value={guideData.guideEmail}
                  onChange={handleGuideDataChange}
                  placeholder="guide@example.com"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              {errors.guideEmail && (
                <p style={errorStyle}>{errors.guideEmail._errors[0]}</p>
              )}
            </div>

            {/* Phone and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    name="guidePhoneNumber"
                    value={guideData.guidePhoneNumber}
                    onChange={handleGuideDataChange}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                {errors.guidePhoneNumber && (
                  <p style={errorStyle}>{errors.guidePhoneNumber._errors[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="guideAddress"
                    value={guideData.guideAddress}
                    onChange={handleGuideDataChange}
                    placeholder="City, Country"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            Professional Details
          </h3>

          <div className="space-y-4">
            {/* Salary */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Monthly Salary
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="guideSalary"
                  value={guideData.guideSalary || ""}
                  onChange={handleGuideDataChange}
                  placeholder="e.g., 45000"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter monthly salary in your local currency
              </p>
              {errors.guideSalary && (
                <p style={errorStyle}>{errors.guideSalary._errors[0]}</p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Profile Photo
              </label>

              {imagePreview && (
                <div className="mb-4 relative inline-block">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                    <Image
                      src={imagePreview}
                      alt="Guide preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 transition border border-blue-200 w-fit">
                <Upload size={18} />
                <span>{imagePreview ? "Change Photo" : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Max size: 2MB. Formats: JPG, PNG, JPEG
              </p>
            </div>

            {/* Tour Assignment */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Assign to Tour (Optional)
              </label>
              {tourStatus === Status.LOADING ? (
                <p className="text-gray-500 text-sm">Loading tours...</p>
              ) : (
                <select
                  name="tourId"
                  onChange={handleTourSelect}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select a tour to assign</option>
                  {tour
                    .filter((t: any) => t.tourStatus === "active")
                    .map((t: any) => (
                      <option key={t.tourId} value={t.tourId}>
                        {t.tourTitle} -{" "}
                        {new Date(t.tourStartDate).toLocaleDateString()}
                      </option>
                    ))}
                </select>
              )}

              {selectedTour && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {selectedTour.tourTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          selectedTour.tourStartDate
                        ).toLocaleDateString()}{" "}
                        - {selectedTour.tourDuration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTourRemove}
                      className="text-red-600 hover:text-red-700 p-2 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={guideStatus === Status.LOADING}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 cursor-pointer rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {guideStatus === Status.LOADING
              ? "Creating Guide..."
              : "Create Guide"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
