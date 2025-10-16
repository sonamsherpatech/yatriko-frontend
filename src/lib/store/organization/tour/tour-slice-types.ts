import { Status } from "@/lib/types";

export interface IOrganizationTourType {
  tourId?: string;
  tourTitle: string;
  tourDescription: string;
  tourNumberOfPeople: string;
  tourPrice: string;
  tourDuration: string;
  tourPhoto?: File | string;
  tourEndDate: string;
  tourStartDate: string;
  tourStatus?: string;
  categoryIds: string[];
}

export interface IOrganizationTourInitialState {
  tour: IOrganizationTourType[];
  status: Status;
  error: string | null;
}
