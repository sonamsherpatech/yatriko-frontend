// src/app/dashboard/organization/guide/edit/[id]/page.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getCategories } from "@/lib/store/organization/category/category-slice";
import {
  getGuideById,
  resetStatus,
  updateGuide,
} from "@/lib/store/organization/guide/guide-slice";
import { Status } from "@/lib/types";
import {
  ArrowLeft,
  Upload,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { showToast } from "@/lib/toastify/toastify";
import { getTours } from "@/lib/store/organization/tour/tour-slice";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

interface EditGuideData {
  guideName: string;
  guideEmail: string;
  guidePhoneNumber: string;
  guideAddress: string;
  guideSalary: number;
  guideStatus: "active" | "inactive" | "suspended";
  tourId: string | null;
  guideImage?: File | string;
}

export default function EditGuide() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const guideId = params.id as string;

  const {
    currentGuide,
    status: guideStatus,
    error,
  } = useAppSelector((store) => store.organizationGuide);
  const { tour, status: tourStatus } = useAppSelector(
    (store) => store.organizationTour
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState<boolean>(true);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [editedGuideData, setEditedGuideData] = useState<EditGuideData>({
    guideName: "",
    guideEmail: "",
    guidePhoneNumber: "",
    guideAddress: "",
    guideSalary: 0,
    guideStatus: "active",
    tourId: null,
    guideImage: "",
  });

  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    dispatch(resetStatus());
    dispatch(getGuideById(guideId));
    dispatch(getTours());
  }, [dispatch, guideId]);

  useEffect(() => {
    if (currentGuide) {
      setEditedGuideData({
        guideName: currentGuide.guideName || "",
        guideEmail: currentGuide.guideEmail || "",
        guidePhoneNumber: currentGuide.guidePhoneNumber || "",
        guideAddress: currentGuide.guideAddress || "",
        guideSalary: currentGuide.guideSalary || 0,
        guideStatus: currentGuide.guideStatus || "active",
        tourId: currentGuide.tourId || null,
        guideImage: currentGuide.guideImage || "",
      });

      if (
        currentGuide.guideImage &&
        typeof currentGuide.guideImage === "string"
      ) {
        setImagePreview(currentGuide.guideImage);
        setKeepExistingImage(true);
      }

      // Set selected tour if guide is assigned
      if (currentGuide.tourId && tour.length > 0) {
        const assignedTour = tour.find(
          (t: any) => t.tourId === currentGuide.tourId
        );
        if (assignedTour) {
          setSelectedTour(assignedTour);
        }
      }
    }
  }, [currentGuide, tour]);

  useEffect(() => {
    if (isSubmitting && guideStatus === Status.SUCCESS) {
      setIsSubmitting(false);
      showToast({
        text: "Guide updated successfully",
        style: {
          background: "#008000",
          color: "white",
        },
      });
      router.push("/dashboard/organization/guide");
    } else if (guideStatus === Status.ERROR) {
      setIsSubmitting(false);
      showToast({
        text: error || "Failed to update guide",
        style: {
          background: "#800000",
          color: "white",
        },
      });
    }
  }, [guideStatus, router, error, isSubmitting]);

  function handleGuideDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditedGuideData({
      ...editedGuideData,
      [name]: name === "guideSalary" ? parseFloat(value) || 0 : value,
    });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
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

      setNewImageFile(file);
      setKeepExistingImage(false);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveNewImage() {
    setNewImageFile(null);
    const originalPhoto = currentGuide?.guideImage;
    setImagePreview(typeof originalPhoto === "string" ? originalPhoto : null);
    setKeepExistingImage(true);
  }

  function handleTourSelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedTourId = e.target.value;

    if (!selectedTourId) {
      setSelectedTour(null);
      setEditedGuideData({ ...editedGuideData, tourId: null });
      return;
    }

    const selectedT = tour.find((t: any) => t.tourId === selectedTourId);
    if (!selectedT) return;

    setSelectedTour(selectedT);
    setEditedGuideData({ ...editedGuideData, tourId: selectedT.tourId });
  }

  function handleTourRemove() {
    setSelectedTour(null);
    setEditedGuideData({ ...editedGuideData, tourId: null });
  }

  function handleGuideDataSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    const submitData = new FormData();

    submitData.append("guideName", editedGuideData.guideName);
    submitData.append("guideEmail", editedGuideData.guideEmail);
    submitData.append("guidePhoneNumber", editedGuideData.guidePhoneNumber);
    submitData.append("guideAddress", editedGuideData.guideAddress || "");
    submitData.append("guideSalary", editedGuideData.guideSalary.toString());
    submitData.append("guideStatus", editedGuideData.guideStatus);

    if (editedGuideData.tourId) {
      submitData.append("tourId", editedGuideData.tourId);
    }

    if (newImageFile) {
      submitData.append("guideImage", newImageFile);
    }

    setErrors({});
    dispatch(updateGuide({ guideId, data: submitData }));
  }

  if (guideStatus === Status.LOADING && !currentGuide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.push(`/dashboard/organization/guide`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 cursor-pointer transition"
      >
        <ArrowLeft size={20} /> Back to guides
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Guide</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update guide information and tour assignment
            </p>
          </div>
          {currentGuide && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentGuide.guideStatus === "active"
                  ? "bg-green-100 text-green-700"
                  : currentGuide.guideStatus === "inactive"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentGuide.guideStatus?.toUpperCase()}
            </span>
          )}
        </div>

        {/* Current Assignment Info */}
        {currentGuide && currentGuide.tourId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Currently Assigned:</strong>{" "}
                  {currentGuide.tourTitle || currentGuide.assignedTourTitle}
                </p>
                {currentGuide.tourStartDate && (
                  <p className="text-xs text-blue-600 mt-1">
                    Tour Date:{" "}
                    {new Date(currentGuide.tourStartDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleGuideDataSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-blue-600" size={20} />
              Personal Information
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="guideName"
                    value={editedGuideData.guideName}
                    onChange={handleGuideDataChange}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="guideEmail"
                    value={editedGuideData.guideEmail}
                    onChange={handleGuideDataChange}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Changing email will require guide to use new email for
                  login
                </p>
              </div>

              {/* Phone and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="guidePhoneNumber"
                      value={editedGuideData.guidePhoneNumber}
                      onChange={handleGuideDataChange}
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      required
                    />
                  </div>
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
                      value={editedGuideData.guideAddress}
                      onChange={handleGuideDataChange}
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="text-blue-600" size={20} />
              Professional Details
            </h3>

            <div className="space-y-4">
              {/* Salary and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={editedGuideData.guideSalary || ""}
                      onChange={handleGuideDataChange}
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="guideStatus"
                    value={editedGuideData.guideStatus}
                    onChange={handleGuideDataChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
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
                    {newImageFile && (
                      <button
                        type="button"
                        onClick={handleRemoveNewImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {newImageFile ? "New image selected" : "Current image"}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 transition border border-blue-200">
                    <Upload size={18} />
                    <span>
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && newImageFile && (
                    <button
                      type="button"
                      onClick={handleRemoveNewImage}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Keep original image
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: 2MB. Formats: JPG, PNG, JPEG
                </p>
              </div>

              {/* Tour Assignment */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Assign to Tour
                </label>
                {tourStatus === Status.LOADING ? (
                  <p className="text-gray-500 text-sm">Loading tours...</p>
                ) : (
                  <select
                    value={editedGuideData.tourId || ""}
                    onChange={handleTourSelect}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">No assignment (Available)</option>
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
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {isSubmitting ? "Updating..." : "Update Guide"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 md:flex-none bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 cursor-pointer transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
