"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getCategories } from "@/lib/store/organization/category/category-slice";
import { IOrganizationCategoryType } from "@/lib/store/organization/category/category-slice-types";
import {
  editTour,
  getTourById,
  resetStatus,
} from "@/lib/store/organization/tour/tour-slice";
import { IOrganizationTourType } from "@/lib/store/organization/tour/tour-slice-types";
import { Status } from "@/lib/types";
import { ArrowLeft, Calendar, Upload, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

  const [selectedCategories, setSelectedCategories] = useState<
    IOrganizationCategoryType[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editedTourData, setEditedTourData] = useState<IOrganizationTourType>({
    tourTitle: "",
    tourDescription: "",
    tourPrice: "",
    tourNumberOfPeople: "",
    tourDuration: "",
    tourStartDate: "",
    tourEndDate: "",
    tourPhoto: "",
    tourStatus: "active",
    categoryIds: [],
  });

  //Fetch Tour data and categories on mount
  useEffect(() => {
    dispatch(resetStatus());
    dispatch(getTourById(tourId));
    dispatch(getCategories());
  }, [dispatch, tourId]);

  // Populate form when currentTour is loaded
  useEffect(() => {
    if (currentTour) {
      // Extract categoryIds from categories array if it exists
      const categoryIds = currentTour.categories
        ? currentTour.categories.map((cat: any) => cat.categoryId)
        : currentTour.categoryIds || [];

      console.log(categoryIds, "Category IDs");
      setEditedTourData({
        tourTitle: currentTour.tourTitle || "",
        tourDescription: currentTour.tourDescription || "",
        tourNumberOfPeople: currentTour.tourNumberOfPeople || "",
        tourPrice: currentTour.tourPrice || "",
        tourDuration: currentTour.tourDuration || "",
        tourStartDate: currentTour.tourStartDate || "",
        tourStatus: currentTour.tourStatus || "active",
        tourEndDate: currentTour.tourEndDate || "",
        categoryIds: categoryIds,
        tourPhoto: currentTour.tourPhoto || "",
      });

      // Set image preview
      if (currentTour.tourPhoto && typeof currentTour.tourPhoto === "string") {
        setImagePreview(currentTour.tourPhoto);
        setKeepExistingImage(true);
      }
    }
  }, [currentTour]);

  // SEPARATE useEffect for loading categories - this is the fix!
  useEffect(() => {
    console.log("=== CATEGORY LOADING DEBUG ===");
    console.log("Current Tour:", currentTour);
    console.log("Current Tour categories:", currentTour?.categories);
    console.log("Current Tour Category IDs:", currentTour?.categoryIds);
    console.log("All Categories:", category);
    console.log("Category length:", category?.length);

    if (currentTour && category && category.length > 0) {
      // Get category IDs from either categories array or categoryIds field
      let tourCategoryIds: string[] = [];

      if (currentTour.categories && Array.isArray(currentTour.categories)) {
        // Backend returned full category objects
        tourCategoryIds = currentTour.categories.map((cat: any) =>
          String(cat.categoryId)
        );
      } else if (
        currentTour.categoryIds &&
        Array.isArray(currentTour.categoryIds)
      ) {
        // Backend returned just IDs
        tourCategoryIds = currentTour.categoryIds.map((id) => String(id));
      }

      console.log("Extracted category IDs:", tourCategoryIds);

      if (tourCategoryIds.length > 0) {
        const selected = category.filter((cat: IOrganizationCategoryType) => {
          const matches = tourCategoryIds.includes(String(cat.id));
          console.log(`Category ${cat.categoryName} (${cat.id}): ${matches}`);
          return matches;
        });

        console.log("Selected Categories:", selected);
        setSelectedCategories(selected);
      }
    } else {
      console.log("Conditions not met:");
      console.log("- currentTour exists:", !!currentTour);
      console.log("- category exists:", !!category);
      console.log("- category length:", category?.length);
    }
  }, [currentTour?.categories, currentTour?.categoryIds, category]);

  useEffect(() => {
    if (isSubmitting && status === Status.SUCCESS) {
      router.push("/dashboard/organization/tour");
    }
  }, [status, router, isSubmitting]);

  function handleTourDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditedTourData({
      ...editedTourData,
      [name]: value,
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
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("tourTitle", editedTourData.tourTitle || "");
    submitData.append("tourDescription", editedTourData.tourDescription || "");
    submitData.append(
      "tourNumberOfPeople",
      editedTourData.tourNumberOfPeople || ""
    );
    submitData.append("tourPrice", editedTourData.tourPrice || "");
    submitData.append("tourDuration", editedTourData.tourDuration || "");
    submitData.append("tourStartDate", editedTourData.tourStartDate || "");
    submitData.append("tourEndDate", editedTourData.tourEndDate || "");
    submitData.append("tourStatus", editedTourData.tourStatus || "active");

    if (editedTourData.categoryIds && editedTourData.categoryIds.length > 0) {
      submitData.append(
        "categoryIds",
        JSON.stringify(editedTourData.categoryIds)
      );
    }

    if (newImageFile) {
      submitData.append("tourPhoto", newImageFile);
    }

    dispatch(editTour({ tourId, data: submitData }));
  }

  if (status === Status.LOADING && !currentTour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading tour details...</div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 ml-4 mb-6 cursor-pointer"
      >
        <ArrowLeft size={20} /> Back to tours
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Tour</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleTourDataSubmit} className="space-y-4">
          {/* Tour Title */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="tourTitle"
              value={editedTourData.tourTitle}
              onChange={handleTourDataChange}
              placeholder="Enter tour name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Tour Description */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Description
            </label>
            <textarea
              rows={4}
              name="tourDescription"
              value={editedTourData.tourDescription}
              onChange={handleTourDataChange}
              placeholder="Write a short description..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tour Price and Tour Number of People */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Number of People
              </label>
              <input
                type="number"
                name="tourNumberOfPeople"
                value={editedTourData.tourNumberOfPeople}
                onChange={handleTourDataChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                name="tourPrice"
                value={editedTourData.tourPrice}
                onChange={handleTourDataChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  {newImageFile
                    ? "New image selected"
                    : "Current image from database"}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition">
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

          {/* Tour Duration and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="tourStatus"
                value={editedTourData.tourStatus}
                onChange={handleTourDataChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Duration
              </label>
              <input
                type="text"
                disabled={true}
                value={editedTourData.tourDuration}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Start Date
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <input
                  type="date"
                  name="tourStartDate"
                  value={editedTourData.tourStartDate}
                  onChange={handleTourDataChange}
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                End Date
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <input
                  type="date"
                  name="tourEndDate"
                  value={editedTourData.tourEndDate}
                  onChange={handleTourDataChange}
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Category
            </label>
            {status === Status.LOADING && category.length === 0 ? (
              <p className="text-gray-500 text-sm">Loading categories...</p>
            ) : (
              <select
                onChange={handleCategorySelect}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {category.map((cat: IOrganizationCategoryType) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            )}

            {/* Selected Categories Display */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="flex items-center gap-1 bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm"
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={status === Status.LOADING}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === Status.LOADING ? "Updating..." : "Update Tour"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
