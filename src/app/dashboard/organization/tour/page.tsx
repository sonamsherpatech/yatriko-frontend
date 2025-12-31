// src/app/dashboard/organization/tour/page.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getCategories } from "@/lib/store/organization/category/category-slice";
import {
  deleteTour,
  getTours,
  resetStatus,
} from "@/lib/store/organization/tour/tour-slice";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";
import {
  Edit3,
  MousePointerSquareDashed,
  Trash2,
  Calendar,
  Users,
  TrendingDown,
  Clock,
  Search,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OrganizationTour() {
  const router = useRouter();
  const {
    error,
    status,
    tour: tours,
  } = useAppSelector((store) => store.organizationTour);
  const { category } = useAppSelector((store) => store.organizationCategory);
  const dispatch = useAppDispatch();
  const isDeleting = useRef(false);

  const [tourQuery, setTourQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleCreateTour = () => {
    dispatch(resetStatus());
    router.push("/dashboard/organization/tour/create");
  };

  const handleSelectTour = (tourId?: string) => {
    if (tourId) {
      dispatch(resetStatus());
      router.push(`/dashboard/organization/tour/${tourId}`);
    }
  };

  const handleEditTour = (tourId?: string) => {
    if (tourId) {
      dispatch(resetStatus());
      router.push(`/dashboard/organization/tour/edit/${tourId}`);
    }
  };

  const handleDeleteTour = (tourId?: string) => {
    if (tourId && confirm("Are you sure you want to delete this tour?")) {
      isDeleting.current = true;
      dispatch(deleteTour(tourId));
      dispatch(resetStatus());
    }
  };

  useEffect(() => {
    dispatch(getTours());
    dispatch(getCategories());
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isDeleting.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Deleted tour successfully",
          style: {
            color: "white",
            background: "#008000",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to delete tour",
          style: {
            color: "white",
            background: "#800000",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      }
    }
  }, [status, error, dispatch]);

  // Filter tours by search and status
  const filteredData = tours?.filter((tour) => {
    const matchesSearch = tour.tourTitle
      .toLowerCase()
      .includes(tourQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || tour.tourStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (status === Status.LOADING && tours.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (category.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <div className="mb-2">First create categories</div>
        <button
          className="inline-block px-4 py-2 bg-blue-600 text-gray-100 rounded-full cursor-pointer hover:bg-blue-800 transition"
          onClick={() => router.push("/dashboard/organization/category")}
        >
          Go to Category
        </button>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tours</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your tours with dynamic pricing
            </p>
          </div>
          <button
            onClick={handleCreateTour}
            className="bg-blue-600 cursor-pointer text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <span className="text-lg font-bold">+</span>
            Add Tour
          </button>
        </div>

        {/* Search, Filter, and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="SearchTour"
              onChange={(e) => setTourQuery(e.target.value)}
              value={tourQuery}
              placeholder="Search tours by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === "card"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "card" ? (
          <CardView
            tours={filteredData}
            onEdit={handleEditTour}
            onDelete={handleDeleteTour}
            onSelect={handleSelectTour}
          />
        ) : (
          <TableView
            tours={filteredData}
            onEdit={handleEditTour}
            onDelete={handleDeleteTour}
            onSelect={handleSelectTour}
          />
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">
              {tourQuery ? "No tours match your search" : "No tours found"}
            </p>
            <button
              onClick={handleCreateTour}
              className="text-blue-600 hover:underline mt-2"
            >
              Create your first tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Card View Component
function CardView({ tours, onEdit, onDelete, onSelect }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour: any) => (
        <TourCard
          key={tour.tourId}
          tour={tour}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// Tour Card Component
function TourCard({ tour, onEdit, onDelete, onSelect }: any) {
  // Add safety checks for tour data
  if (!tour) return null;

  const {
    pricing = {},
    capacity = {},
    tourTitle = "Untitled Tour",
    tourDescription = "",
    tourPhoto = "",
    tourDuration = "N/A",
    tourStartDate = new Date().toISOString(),
    tourStatus = "active",
    categories = [],
  } = tour;

  // Ensure pricing has default values
  const safepricing = {
    basePrice: pricing?.basePrice || 0,
    currentPrice: pricing?.currentPrice || 0,
    savings: pricing?.savings || 0,
    discountPercentage: pricing?.discountPercentage || 0,
    discountReason: pricing?.discountReason || null,
  };

  // Ensure capacity has default values
  const safeCapacity = {
    total: capacity?.total || 0,
    booked: capacity?.booked || 0,
    available: capacity?.available || 0,
    occupancyRate: capacity?.occupancyRate || "0%",
  };

  // Calculate days until tour
  const daysUntil = Math.ceil(
    (new Date(tourStartDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Determine urgency info
  const getUrgencyInfo = () => {
    const occupancy = parseFloat(safeCapacity.occupancyRate);
    if (occupancy >= 90) {
      return { color: "bg-red-500", message: "Almost Sold Out!" };
    } else if (daysUntil <= 3 && daysUntil > 0) {
      return { color: "bg-orange-500", message: "Last Minute Deal!" };
    } else if (daysUntil <= 7 && daysUntil > 0) {
      return { color: "bg-yellow-500", message: "Booking Soon!" };
    } else if (safepricing.discountPercentage >= 20) {
      return { color: "bg-green-500", message: "Early Bird Special!" };
    }
    return null;
  };

  const urgency = getUrgencyInfo();

  // Format discount reason
  const formatDiscountReason = (reason: string | null | undefined) => {
    if (!reason) return "Standard Pricing";
    return reason
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            tourPhoto ||
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400"
          }
          alt={tourTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
            tourStatus === "active"
              ? "bg-green-500 text-white"
              : tourStatus === "inactive"
              ? "bg-gray-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {tourStatus.toUpperCase()}
        </div>

        {/* Urgency Badge */}
        {urgency && (
          <div
            className={`absolute top-3 right-3 ${urgency.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse`}
          >
            {urgency.message}
          </div>
        )}

        {/* Discount Badge */}
        {safepricing.discountPercentage > 0 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {safepricing.discountPercentage.toFixed(0)}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition">
          {tourTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tourDescription || "No description available"}
        </p>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.slice(0, 2).map((cat: any) => (
              <span
                key={cat.categoryId}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {cat.categoryName}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Tour Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {new Date(tourStartDate).toLocaleDateString()}
            </span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{tourDuration}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {safeCapacity.available} of {safeCapacity.total} seats available
            </span>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Occupancy</span>
            <span className="font-semibold">{safeCapacity.occupancyRate}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                parseFloat(safeCapacity.occupancyRate) >= 90
                  ? "bg-red-500"
                  : parseFloat(safeCapacity.occupancyRate) >= 70
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
              style={{ width: safeCapacity.occupancyRate }}
            ></div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">
              {formatDiscountReason(safepricing.discountReason)}
            </p>
            <div className="flex items-baseline gap-2">
              {safepricing.savings > 0 && (
                <span className="text-base text-gray-400 line-through">
                  ${safepricing.basePrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-green-600">
                ${safepricing.currentPrice.toFixed(2)}
              </span>
            </div>
            {safepricing.savings > 0 && (
              <p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" />
                Save ${safepricing.savings.toFixed(2)} per person
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onSelect(tour.tourId)}
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              View
            </button>
            <button
              onClick={() => onEdit(tour.tourId)}
              className="px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              title="Edit"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(tour.tourId)}
              className="px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Pricing Indicator */}
        {daysUntil > 0 && (
          <div className="mt-3 text-xs text-gray-500 text-center bg-amber-50 py-2 rounded-lg">
            ⚡ Price updates dynamically • {daysUntil} days until departure
          </div>
        )}
      </div>
    </div>
  );
}

// Table View Component
function TableView({ tours, onEdit, onDelete, onSelect }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-gray-700 text-left bg-gray-50">
            <th className="px-4 py-3 border-b font-semibold">Tour</th>
            <th className="px-4 py-3 border-b font-semibold">Capacity</th>
            <th className="px-4 py-3 border-b font-semibold">Pricing</th>
            <th className="px-4 py-3 border-b font-semibold">Discount</th>
            <th className="px-4 py-3 border-b font-semibold">Status</th>
            <th className="px-4 py-3 border-b font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour: any) => (
            <tr
              key={tour.tourId}
              className="hover:bg-gray-50 transition-colors border-b"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      tour.tourPhoto ||
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100"
                    }
                    alt={tour.tourTitle}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {tour.tourTitle}
                    </p>
                    <p className="text-xs text-gray-500">{tour.tourDuration}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    {tour.capacity.booked}/{tour.capacity.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tour.capacity.occupancyRate}
                  </p>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  {tour.pricing.savings > 0 && (
                    <p className="text-xs text-gray-400 line-through">
                      ${tour.pricing.basePrice.toFixed(2)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-green-600">
                    ${tour.pricing.currentPrice.toFixed(2)}
                  </p>
                </div>
              </td>
              <td className="px-4 py-4">
                {tour.pricing.discountPercentage > 0 ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {tour.pricing.discountPercentage.toFixed(0)}% OFF
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">No discount</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tour.tourStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : tour.tourStatus === "inactive"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tour.tourStatus}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onSelect(tour.tourId)}
                    title="View Details"
                    className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  >
                    <MousePointerSquareDashed size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(tour.tourId)}
                    title="Edit"
                    className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(tour.tourId)}
                    title="Delete"
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
