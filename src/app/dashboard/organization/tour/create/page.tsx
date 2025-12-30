"use client";
import { ArrowLeft, Calendar, Info, X } from "lucide-react";
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
    totalCapacity: "",
    basePrice: "",
    tourDuration: "",
    tourPhoto: "",
    tourEndDate: "",
    tourStartDate: "",
    categoryIds: [],
  });
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [estimatedPricing, setEstimatedPricing] = useState({
    currentPrice: 0,
    discount: 0,
    discountReason: "",
  });

  useEffect(() => {
    if (!category.length) {
      dispatch(getCategories());
    }
  }, [category.length, dispatch]);

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
  }, [error, dispatch, tourStatus, router]);

  //Calculating Estimated pricing preview
  useEffect(() => {
    if (data.basePrice && data.tourStartDate) {
      const basePrice = parseFloat(data.basePrice);
      const startDate = new Date(data.tourStartDate);
      const now = new Date();
      const daysUntill = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      let discount = 0;
      let reason = "";

      //Time-based discount logic
      if (daysUntill > 60) {
        discount = 25;
        reason = "Super Early Bird";
      } else if (daysUntill > 30) {
        discount = 20;
        reason = "Early Bird";
      } else if (daysUntill > 14) {
        discount = 10;
        reason = "Advance Booking";
      } else if (daysUntill > 7) {
        discount = 5;
        reason = "Last Week";
      } else if (daysUntill >= 1) {
        discount = 30;
        reason = "Last Minute";
      } else {
        discount = 40;
        reason = "Same Day";
      }

      const occupancyDiscount = 25;
      const combineDiscount = discount * 0.6 + occupancyDiscount * 0.4;

      const minimumPrice = basePrice * 0.7;
      let currentPrice = basePrice * (1 - combineDiscount / 100);
      currentPrice = Math.max(currentPrice, minimumPrice);

      setEstimatedPricing({
        currentPrice: Math.round(currentPrice * 100) / 100,
        discount: Math.round(combineDiscount * 100) / 100,
        discountReason: reason,
      });
    }
  }, [data.basePrice, data.tourStartDate]);

  function handleTourDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    let updatedData = {
      ...data,
      [name]: value,
    };

    //Automatically duaration calcluation
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
    const file = e.target.files?.[0];
    if (file) {
      setData({
        ...data,
        tourPhoto: file,
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Create Tour with Dynamic Pricing
        </h2>
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to tour
        </button>
      </div>

      {/* Pricing Preview Card */}
      {data.basePrice && data.tourStartDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Info className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-gray-800">
                Estimated Initial Pricing
              </h3>
              <p className="text-sm text-gray-600">
                This price will be calculated dynamically based on bookings and
                time
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Base Price</p>
              <p className="text-xl font-bold text-gray-800">
                NPR{parseFloat(data.basePrice).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Initial Price</p>
              <p className="text-xl font-bold text-green-600">
                NPR{estimatedPricing.currentPrice.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 font-medium">
                {estimatedPricing.discount.toFixed(0)}% OFF
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Discount Type</p>
              <p className="text-sm font-semibold text-blue-600">
                {estimatedPricing.discountReason}
              </p>
              <p className="text-xs text-gray-600">
                Save NPR
                {(
                  parseFloat(data.basePrice) - estimatedPricing.currentPrice
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleTourDataSubmission} className="space-y-5">
        {/* Tour Title */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Tour Name
          </label>
          <input
            type="text"
            name="tourTitle"
            onChange={handleTourDataChange}
            placeholder="e.g., Everest Base Camp Trek"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.tourTitle && (
            <p style={errorStyle}>{errors.tourTitle._errors[0]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Description
          </label>
          <textarea
            rows={4}
            name="tourDescription"
            onChange={handleTourDataChange}
            placeholder="Write a detailed description of your tour..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
          {errors.tourDescription && (
            <p style={errorStyle}>{errors.tourDescription._errors[0]}</p>
          )}
        </div>

        {/* Capacity & Base Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Total Capacity
            </label>
            <input
              type="number"
              name="totalCapacity"
              onChange={handleTourDataChange}
              placeholder="e.g. 50"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of people allowed
            </p>
            {errors.totalCapacity && (
              <p style={errorStyle}>{errors.totalCapacity._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Base Price (per person)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">NPR</span>
              <input
                type="number"
                name="basePrice"
                onChange={handleTourDataChange}
                placeholder="e.g. 1500"
                className="w-full border border-gray-300 rounded-lg p-2 pl-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Original price before discounts
            </p>
            {errors.basePrice && (
              <p style={errorStyle}>{errors.basePrice._errors[0]}</p>
            )}
          </div>
        </div>

        {/* Photo & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Tour Photo
            </label>
            <input
              type="file"
              accept="image/*"
              name="tourPhoto"
              onChange={handleFileChange}
              className="w-full border border-gray-300 text-sm rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Duration (Auto-calculated)
            </label>
            <input
              type="text"
              disabled={true}
              value={data.tourDuration}
              placeholder="Select dates first"
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-600 outline-none"
            />
            {errors.tourDuration && (
              <p style={errorStyle}>{errors.tourDuration._errors[0]}</p>
            )}
          </div>
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Start Date
            </label>
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <Calendar className="text-gray-500" size={20} />
              <input
                type="date"
                name="tourStartDate"
                onChange={handleTourDataChange}
                className="w-full text-sm outline-none"
                min={new Date().toISOString().split("T")[0]}
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
            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <Calendar className="text-gray-500" size={20} />
              <input
                type="date"
                name="tourEndDate"
                onChange={handleTourDataChange}
                className="w-full text-sm outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {errors.tourEndDate && (
              <p style={errorStyle}>{errors.tourEndDate._errors[0]}</p>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Categories
          </label>
          {status === Status.LOADING ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : (
            <select
              onChange={handleCategorySelect}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              {category.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
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
          {errors.categoryIds && (
            <p style={errorStyle}>{errors.categoryIds._errors[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={tourStatus === Status.LOADING}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {tourStatus === Status.LOADING ? "Creating Tour..." : "Create Tour"}
        </button>
      </form>
    </div>
  );
}
