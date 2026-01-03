import { Status } from "@/lib/types";

export interface IOrganizationGuide {
  id?: string;
  guideName: string;
  guideEmail: string;
  guidePhoneNumber: string;
  guideAddress: string;
  guideImage?: File | string;
  guideJoinedDate?: string;
  guideSalary?: number;
  guideStatus?: "active" | "inactive" | "suspended";
  guidePassword?: string;
  tourId: string | null;

  //Tour Information
  assignedTourTitle?: string;
  tourStartDate?: string;
  tourEndDate?: string;
  tourTitle?: string;
  tourStatus?: string;
  tourDuration?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IGuideStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  assigned: number;
  available: number;
}

export interface IOrganizationGuideInitialState {
  guide: IOrganizationGuide[];
  stats: IGuideStats;
  currentGuide: IOrganizationGuide | null;
  status: Status;
  error: null | string;
}
