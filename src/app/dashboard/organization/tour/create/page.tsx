"use client";
import { ArrowLeft, Calendar, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import schema from "./organization-tour-validation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getCategories,
  resetStatus as resetCategoryStatus,
} from "@/lib/store/organization/category/category-slice";
import { Status } from "@/lib/types";
import { IOrganizationCategoryType } from "@/lib/store/organization/category/category-slice-types";
import {
  createTour,
  resetStatus as resetTourStatus,
} from "@/lib/store/organization/tour/tour-slice";
import { showToast } from "@/lib/toastify/toastify";
import { IOrganizationTourType } from "./organization-tour-types";

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

export default function CreateTour() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { category, status } = useAppSelector(
    (store) => store.organizationCategory
  );
  const { error, status: tourStatus } = useAppSelector(
    (store) => store.organizationTour
  );

  const [selectedCategories, setSelectedCategories] = useState<
    IOrganizationCategoryType[]
  >([]);
  const [data, setData] = useState<IOrganizationTourType>({
    tourTitle: "",
    tourDescription: "",
    tourNumberOfPeople: "",
    tourPrice: "",
    tourDuration: "",
    tourPhoto: "",
    tourEndDate: "",
    tourStartDate: "",
    categoryIds: [],
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!category.length) {
      dispatch(getCategories());
    }
  }, [category.length, dispatch]);

  // dispatch(resetStatus());
  useEffect(() => {
    dispatch(resetCategoryStatus());
    dispatch(resetTourStatus());
  }, []);

  useEffect(() => {
    if (tourStatus === Status.SUCCESS) {
      showToast({
        text: "Tour Created Successfully",
        style: {
          background: "#008000",
          color: "white",
        },
      });
      dispatch(resetTourStatus());
      router.push("/dashboard/organization/tour");
    } else if (tourStatus === Status.ERROR) {
      showToast({
        text: error || "Failed to create tour",
        style: {
          background: "#800000",
          color: "white",
        },
      });
    }
  }, [error, dispatch, tourStatus]);

  function handleTourDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    let updatedData = {
      ...data,
      [name]: value,
    };

    //automatically duaration calcluation
    if (name === "tourStartDate" || name === "tourEndDate") {
      const { tourStartDate, tourEndDate } = updatedData;
      if (tourStartDate && tourEndDate) {
        const start = new Date(tourStartDate);
        const end = new Date(tourEndDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        updatedData.tourDuration = diffDays > 0 ? diffDays.toString() : "0";
      } else {
        updatedData.tourDuration = "";
      }
    }
    setData(updatedData);
  }

  function handleTourDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
      dispatch(createTour(data));
    }
  }

  function handleCategorySelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;

    if (!selectedId) return;

    const selectedCat = category.find((cat: any) => cat.id === selectedId);
    if (!selectedCat) return;

    const isAlreadySelected = selectedCategories.some(
      (c) => c.id === selectedCat.id
    );

    if (!isAlreadySelected) {
      const updatedCategories = [...selectedCategories, selectedCat];
      setSelectedCategories(updatedCategories);

      setData({
        ...data,
        categoryIds: updatedCategories.map((cat) => cat.id),
      });
    }

    e.target.value = "";
  }

  function handleRemoveCategory(catId: string) {
    const updatedCategories = selectedCategories.filter((c) => c.id !== catId);
    setSelectedCategories(updatedCategories);

    setData({
      ...data,
      categoryIds: updatedCategories.map((cat) => cat.categoryDescription),
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      setData({
        ...data,
        tourPhoto: file,
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Create Tour
        </h2>
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
        >
          <span className="text-lg font-bold">{<ArrowLeft size={18} />}</span>
          Back to tour
        </button>
      </div>

      <form onSubmit={handleTourDataSubmission} className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            name="tourTitle"
            onChange={handleTourDataChange}
            placeholder="Enter tour name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.tourTitle && (
            <p style={errorStyle}>{errors.tourTitle._errors[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Description
          </label>
          <textarea
            rows={4}
            name="tourDescription"
            onChange={handleTourDataChange}
            placeholder="Write a short description..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
          {errors.tourDescription && (
            <p style={errorStyle}>{errors.tourDescription._errors[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Number of People
            </label>
            <input
              type="number"
              name="tourNumberOfPeople"
              onChange={handleTourDataChange}
              placeholder="e.g. 10"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.tourNumberOfPeople && (
              <p style={errorStyle}>{errors.tourNumberOfPeople._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              name="tourPrice"
              onChange={handleTourDataChange}
              placeholder="e.g. 2000"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.tourPrice && (
              <p style={errorStyle}>{errors.tourPrice._errors[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                name="tourPhoto"
                onChange={handleFileChange}
                className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Duration
            </label>
            <input
              type="text"
              disabled={true}
              value={data.tourDuration}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.tourDuration && (
              <p style={errorStyle}>{errors.tourDuration._errors[0]}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Start Date
            </label>
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
              <Calendar className="text-gray-500" />
              <input
                type="date"
                name="tourStartDate"
                onChange={handleTourDataChange}
                className="w-full text-sm outline-none"
              />
            </div>
            {errors.tourStartDate && (
              <p style={errorStyle}>{errors.tourStartDate._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              End Date
            </label>
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
              <Calendar className="text-gray-500" />
              <input
                type="date"
                name="tourEndDate"
                onChange={handleTourDataChange}
                className="w-full text-sm outline-none"
              />
            </div>
            {errors.tourEndDate && (
              <p style={errorStyle}>{errors.tourEndDate._errors[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          {status === Status.LOADING ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : (
            <select
              onChange={handleCategorySelect}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none "
            >
              <option value="">Select Category</option>
              {category.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}{" "}
                </option>
              ))}
            </select>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategories.map((cat) => (
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
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Create Tour
        </button>
      </form>
    </div>
  );
}
