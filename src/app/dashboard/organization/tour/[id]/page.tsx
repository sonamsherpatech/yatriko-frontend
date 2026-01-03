"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { resetStatus } from "@/lib/store/organization/tour/tour-slice";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Edit3,
  Info,
  MapPin,
  Percent,
  TrendingDown,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface Pricing {
  basePrice?: number;
  currentPrice?: number;
  savings?: number;
  discountPercentage?: number;
  discountReason?: string;
}

interface Capacity {
  total?: number;
  booked?: number;
  available?: number;
  occupancyRate?: string;
}

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

  //Safe data extraction with default
  const {
    tourTitle = "Untitled Tour",
    tourDescription = "No description available",
    tourPhoto = "",
    tourDuration = "N/A",
    tourStartDate = "",
    tourEndDate = "",
    tourStatus = "active",
    categories = [],
    pricing = {} as Pricing,
    capacity = {} as Capacity,
  } = selectedTour;

  // Safe pricing and capacity with defaults
  const safePricing = {
    basePrice: pricing?.basePrice || 0,
    currentPrice: pricing?.currentPrice || 0,
    savings: pricing?.savings || 0,
    discountPercentage: pricing?.discountPercentage || 0,
    discountReason: pricing?.discountReason || "standard",
  };

  const safeCapacity = {
    total: capacity?.total || 0,
    booked: capacity?.booked || 0,
    available: capacity?.available || 0,
    occupancyRate: capacity?.occupancyRate || "0%",
  };

  const daysUntil = tourStartDate
    ? Math.ceil(
        (new Date(tourStartDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const formatDiscountReason = (reason: string) => {
    if (!reason) return "Standard Pricing";
    return reason
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getUrgencyMessage = () => {
    const occupancy = parseFloat(safeCapacity.occupancyRate);
    if (occupancy >= 90) {
      return {
        message: "Almost Sold Out!",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: AlertCircle,
      };
    } else if (daysUntil <= 3 && daysUntil > 0) {
      return {
        message: "Last Minute Booking Available",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: Clock,
      };
    } else if (daysUntil <= 7 && daysUntil > 0) {
      return {
        message: "Tour Starting Soon",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        icon: Calendar,
      };
    }
    return null;
  };

  const urgency = getUrgencyMessage();

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/tour")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 cursor-pointer transition"
        >
          <ArrowLeft size={20} /> Back to Tours
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tourTitle}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tourStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : tourStatus === "inactive"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {tourStatus.toUpperCase()}
              </span>
              {safePricing.discountPercentage > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  {safePricing.discountPercentage.toFixed(0)}% OFF
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleEditTour(tourId)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-md"
          >
            <Edit3 size={18} />
            Edit Tour
          </button>
        </div>
      </div>

      {/* Urgency Banner */}
      {urgency && (
        <div
          className={`${urgency.bgColor} border-l-4 ${urgency.color.replace(
            "text",
            "border"
          )} p-4 mb-6 rounded-lg`}
        >
          <div className="flex items-center gap-3">
            <urgency.icon className={urgency.color} size={24} />
            <p className={`font-semibold ${urgency.color}`}>
              {urgency.message}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Image */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="relative h-96">
              <Image
                src={
                  tourPhoto ||
                  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
                }
                alt={tourTitle}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="text-blue-600" size={24} />
              Tour Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{tourDescription}</p>
          </div>

          {/* Tour Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tour Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="font-semibold text-gray-800">
                    {tourStartDate
                      ? new Date(tourStartDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="font-semibold text-gray-800">
                    {tourEndDate
                      ? new Date(tourEndDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-800">{tourDuration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Days Until Tour</p>
                  <p className="font-semibold text-gray-800">
                    {daysUntil > 0
                      ? `${daysUntil} days`
                      : daysUntil === 0
                      ? "Today!"
                      : "Past"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <span
                    key={cat.categoryId}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {cat.categoryName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side (1/3) */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Pricing</h2>
            </div>

            {/* Current Price */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Price</p>
              <div className="flex items-baseline gap-2">
                {safePricing.savings > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    NPR{safePricing.basePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-green-600">
                  NPR{safePricing.currentPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">per person</p>
            </div>

            {/* Savings */}
            {safePricing.savings > 0 && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="text-green-600" size={18} />
                  <p className="font-semibold text-green-700">You Save</p>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  NPR{safePricing.savings.toFixed(2)}
                </p>
                <p className="text-xs text-green-600">per person</p>
              </div>
            )}

            {/* Discount Info */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="text-blue-600" size={18} />
                <p className="font-semibold text-gray-700">Discount</p>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {safePricing.discountPercentage.toFixed(0)}% OFF
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatDiscountReason(safePricing.discountReason)}
              </p>
            </div>

            {/* Base Price Reference */}
            <div className="text-xs text-gray-500 border-t pt-3">
              <p className="mb-1">
                Base Price: ${safePricing.basePrice.toFixed(2)}
              </p>
              <p className="text-amber-600 font-medium">
                💡 Price updates dynamically based on demand and time
              </p>
            </div>
          </div>

          {/* Capacity Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Capacity</h2>
            </div>

            <div className="space-y-4">
              {/* Seat Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-gray-800">
                    {safeCapacity.total}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {safeCapacity.booked}
                  </p>
                  <p className="text-xs text-blue-600">Booked</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">
                    {safeCapacity.available}
                  </p>
                  <p className="text-xs text-green-600">Available</p>
                </div>
              </div>

              {/* Occupancy Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Occupancy Rate</span>
                  <span className="font-bold text-gray-800">
                    {safeCapacity.occupancyRate}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
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

              {/* Status Message */}
              <div
                className={`text-center p-3 rounded-lg ${
                  parseFloat(safeCapacity.occupancyRate) >= 90
                    ? "bg-red-50 text-red-700"
                    : parseFloat(safeCapacity.occupancyRate) >= 70
                    ? "bg-orange-50 text-orange-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <p className="font-semibold text-sm">
                  {parseFloat(safeCapacity.occupancyRate) >= 90
                    ? "⚠️ Almost Full!"
                    : parseFloat(safeCapacity.occupancyRate) >= 70
                    ? "🔥 Filling Fast!"
                    : "✅ Good Availability"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
