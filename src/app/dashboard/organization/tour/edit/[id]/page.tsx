"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getCategories } from "@/lib/store/organization/category/category-slice";
import { IOrganizationCategoryType } from "@/lib/store/organization/category/category-slice-types";
import {
  editTour,
  getTourById,
  resetStatus,
} from "@/lib/store/organization/tour/tour-slice";
import { Status } from "@/lib/types";
import { ArrowLeft, Calendar, Upload, X, Info, DollarSign } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import schema from "../../create/organization-tour-validation";
import { showToast } from "@/lib/toastify/toastify";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

interface EditTourData {
  tourTitle: string;
  tourDescription: string;
  totalCapacity: string;
  basePrice: string;
  tourDuration: string;
  tourStartDate: string;
  tourEndDate: string;
  tourPhoto: string | File;
  tourStatus: "active" | "inactive" | "cancelled";
  categoryIds: string[];
}

export default function EditTour() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tourId = params.id as string;

  const { currentTour, status, error } = useAppSelector(
    (store) => store.organizationTour
  );
  const { category } = useAppSelector((store) => store.organizationCategory);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<IOrganizationCategoryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [editedTourData, setEditedTourData] = useState<EditTourData>({
    tourTitle: "",
    tourDescription: "",
    totalCapacity: "",
    basePrice: "",
    tourDuration: "",
    tourStartDate: "",
    tourEndDate: "",
    tourPhoto: "",
    tourStatus: "active",
    categoryIds: [],
  });
  
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [currentPricingInfo, setCurrentPricingInfo] = useState({
    currentPrice: 0,
    discountPercentage: 0,
    discountReason: "",
  });

  useEffect(() => {
    dispatch(resetStatus());
    dispatch(getTourById(tourId));
    dispatch(getCategories());
  }, [dispatch, tourId]);

  useEffect(() => {
    if (currentTour) {
      // Extract capacity info
      const totalCapacity = currentTour.capacity?.total?.toString() || "";
      
      // Extract pricing info
      const basePrice = currentTour.pricing?.basePrice?.toString() || "";
      
      // Extract category IDs
      const categoryIds = currentTour.categories
        ? currentTour.categories.map((cat: any) => cat.categoryId)
        : [];

      setEditedTourData({
        tourTitle: currentTour.tourTitle || "",
        tourDescription: currentTour.tourDescription || "",
        totalCapacity: totalCapacity,
        basePrice: basePrice,
        tourDuration: currentTour.tourDuration || "",
        tourStartDate: currentTour.tourStartDate || "",
        tourEndDate: currentTour.tourEndDate || "",
        tourStatus: currentTour.tourStatus || "active",
        categoryIds: categoryIds,
        tourPhoto: currentTour.tourPhoto || "",
      });

      // Set current pricing info for display
      if (currentTour.pricing) {
        setCurrentPricingInfo({
          currentPrice: currentTour.pricing.currentPrice || 0,
          discountPercentage: currentTour.pricing.discountPercentage || 0,
          discountReason: currentTour.pricing.discountReason || "",
        });
      }

      if (currentTour.tourPhoto && typeof currentTour.tourPhoto === "string") {
        setImagePreview(currentTour.tourPhoto);
        setKeepExistingImage(true);
      }
    }
  }, [currentTour]);

  useEffect(() => {
    if (currentTour && category && category.length > 0) {
      let tourCategoryIds: string[] = [];

      if (currentTour.categories && Array.isArray(currentTour.categories)) {
        tourCategoryIds = currentTour.categories.map((cat: any) =>
          String(cat.categoryId)
        );
      }

      if (tourCategoryIds.length > 0) {
        const selected = category.filter((cat: IOrganizationCategoryType) =>
          tourCategoryIds.includes(String(cat.id))
        );
        setSelectedCategories(selected);
      }
    }
  }, [currentTour?.categories, category]);

  useEffect(() => {
    if (isSubmitting && status === Status.SUCCESS) {
      setIsSubmitting(false);
      showToast({
        text: "Tour updated successfully",
        style: {
          background: "#008000",
          color: "white",
        },
      });
      router.push("/dashboard/organization/tour");
    } else if (status === Status.ERROR) {
      setIsSubmitting(false);
      showToast({
        text: error || "Failed to update tour",
        style: {
          background: "#800000",
          color: "white",
        },
      });
    }
  }, [status, router, error, isSubmitting]);

  function handleTourDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    let updatedData = {
      ...editedTourData,
      [name]: value,
    };

    // Auto-calculate duration
    if (name === "tourStartDate" || name === "tourEndDate") {
      const { tourStartDate, tourEndDate } = updatedData;
      if (tourStartDate && tourEndDate) {
        const start = new Date(tourStartDate);
        const end = new Date(tourEndDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        updatedData.tourDuration = diffDays > 0 ? `${diffDays} Days` : "0 Days";
      } else {
        updatedData.tourDuration = "";
      }
    }
    setEditedTourData(updatedData);
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
    const originalPhoto = currentTour?.tourPhoto;
    setImagePreview(typeof originalPhoto === "string" ? originalPhoto : null);
    setKeepExistingImage(true);
  }

  function handleCategorySelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedCategory = category.find(
      (cat: IOrganizationCategoryType) => String(cat.id) === String(selectedId)
    );

    if (selectedCategory) {
      const isAlreadySelected = selectedCategories.some(
        (cat) => String(cat.id) === String(selectedId)
      );

      if (!isAlreadySelected) {
        const updatedCategories = [...selectedCategories, selectedCategory];
        setSelectedCategories(updatedCategories);

        setEditedTourData({
          ...editedTourData,
          categoryIds: updatedCategories.map((cat) => cat.id),
        });
      }
    }
    e.target.value = "";
  }

  function handleRemoveCategory(categoryId: string) {
    const updatedCategories = selectedCategories.filter(
      (cat) => String(cat.id) !== String(categoryId)
    );
    setSelectedCategories(updatedCategories);

    setEditedTourData({
      ...editedTourData,
      categoryIds: updatedCategories.map((cat) => cat.id),
    });
  }

  function handleTourDataSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(editedTourData);
    
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setIsSubmitting(true);
      const submitData = new FormData();
      
      submitData.append("tourTitle", editedTourData.tourTitle);
      submitData.append("tourDescription", editedTourData.tourDescription);
      submitData.append("totalCapacity", editedTourData.totalCapacity);
      submitData.append("basePrice", editedTourData.basePrice);
      submitData.append("tourDuration", editedTourData.tourDuration);
      submitData.append("tourStartDate", editedTourData.tourStartDate);
      submitData.append("tourEndDate", editedTourData.tourEndDate);
      submitData.append("tourStatus", editedTourData.tourStatus);

      if (editedTourData.categoryIds && editedTourData.categoryIds.length > 0) {
        submitData.append("categoryIds", JSON.stringify(editedTourData.categoryIds));
      }

      if (newImageFile) {
        submitData.append("tourPhoto", newImageFile);
      }

      setErrors({});
      dispatch(editTour({ tourId, data: submitData }));
    }
  }

  if (status === Status.LOADING && !currentTour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <button
        onClick={() => router.push(`/dashboard/organization/tour`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 cursor-pointer transition"
      >
        <ArrowLeft size={20} /> Back to tours
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Tour</h1>
          {currentTour && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentTour.tourStatus === "active" ? "bg-green-100 text-green-700" :
              currentTour.tourStatus === "inactive" ? "bg-gray-100 text-gray-600" :
              "bg-red-100 text-red-700"
            }`}>
              {currentTour.tourStatus?.toUpperCase()}
            </span>
          )}
        </div>

        {/* Current Pricing Info Banner */}
        {currentPricingInfo.currentPrice > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Current Pricing Information</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Current Price</p>
                    <p className="text-lg font-bold text-green-600">
                      NRP{currentPricingInfo.currentPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Discount</p>
                    <p className="text-lg font-bold text-blue-600">
                      {currentPricingInfo.discountPercentage.toFixed(0)}% OFF
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booked</p>
                    <p className="text-lg font-bold text-gray-800">
                      {currentTour?.capacity?.booked || 0}/{currentTour?.capacity?.total || 0}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Price will be recalculated automatically based on new settings
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleTourDataSubmit} className="space-y-6">
          {/* Tour Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tour Title
            </label>
            <input
              type="text"
              name="tourTitle"
              value={editedTourData.tourTitle}
              onChange={handleTourDataChange}
              placeholder="e.g., Everest Base Camp Trek"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            {errors.tourTitle && (
              <p style={errorStyle}>{errors.tourTitle._errors[0]}</p>
            )}
          </div>

          {/* Tour Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              rows={4}
              name="tourDescription"
              value={editedTourData.tourDescription}
              onChange={handleTourDataChange}
              placeholder="Provide a detailed description of your tour..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.tourDescription && (
              <p style={errorStyle}>{errors.tourDescription._errors[0]}</p>
            )}
          </div>

          {/* Capacity and Base Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total Capacity
              </label>
              <input
                type="number"
                name="totalCapacity"
                value={editedTourData.totalCapacity}
                onChange={handleTourDataChange}
                placeholder="e.g., 50"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of people allowed
              </p>
              {errors.totalCapacity && (
                <p style={errorStyle}>{errors.totalCapacity._errors[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Base Price (per person)
              </label>
              <div className="relative">
                <p className="absolute left-3 top-3.5 text-gray-500">NRP</p>
                <input
                  type="number"
                  name="basePrice"
                  value={editedTourData.basePrice}
                  onChange={handleTourDataChange}
                  placeholder="e.g., 1500"
                  className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Original price before dynamic discounts
              </p>
              {errors.basePrice && (
                <p style={errorStyle}>{errors.basePrice._errors[0]}</p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tour Image
            </label>

            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <div className="relative w-64 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Tour preview"
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
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition border border-blue-200">
                <Upload size={18} />
                <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
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

          {/* Status and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tour Status
              </label>
              <select
                name="tourStatus"
                value={editedTourData.tourStatus}
                onChange={handleTourDataChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Duration (Auto-calculated)
              </label>
              <input
                type="text"
                disabled={true}
                value={editedTourData.tourDuration}
                placeholder="Select dates first"
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start Date
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <Calendar className="text-gray-500" size={20} />
                <input
                  type="date"
                  name="tourStartDate"
                  value={editedTourData.tourStartDate}
                  onChange={handleTourDataChange}
                  className="w-full outline-none"
                />
              </div>
              {errors.tourStartDate && (
                <p style={errorStyle}>{errors.tourStartDate._errors[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                End Date
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <Calendar className="text-gray-500" size={20} />
                <input
                  type="date"
                  name="tourEndDate"
                  value={editedTourData.tourEndDate}
                  onChange={handleTourDataChange}
                  className="w-full outline-none"
                />
              </div>
              {errors.tourEndDate && (
                <p style={errorStyle}>{errors.tourEndDate._errors[0]}</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Categories
            </label>
            <select
              onChange={handleCategorySelect}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              {category.map((cat: IOrganizationCategoryType) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    {cat.categoryName}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveCategory(cat.id)}
                    />
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No categories selected</p>
              )}
            </div>
            {errors.categoryIds && (
              <p style={errorStyle}>{errors.categoryIds._errors[0]}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {isSubmitting ? "Updating..." : "Update Tour"}
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