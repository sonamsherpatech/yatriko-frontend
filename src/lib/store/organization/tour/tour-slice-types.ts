import { Status } from "@/lib/types";

export interface IOrganizationTourType {
  tourId: string;
  tourTitle: string;
  tourDescription: string;

  //capacity
  capacity: {
    total: number;
    booked: number;
    available: number;
    occupancyRate: string;
  };

  //pricing fields (From backend response)
  pricing: {
    basePrice: number;
    currentPrice: number;
    savings: number;
    discountPercentage: number;
    discountReason: string;
  };

  tourPhoto: string;
  tourDuration: string;
  tourEndDate: string;
  tourStartDate: string;
  tourStatus: "active" | "inactive" | "cancelled";

  categories: Array<{
    categoryId: string;
    categoryName: string;
  }>;
}

export interface IOrganizationTourInitialState {
  tour: IOrganizationTourType[];
  currentTour: IOrganizationTourType | null;
  status: Status;
  error: string | null;
}
