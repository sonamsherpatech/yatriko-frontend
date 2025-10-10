import { Status } from "@/lib/types";

export interface IOrganizationCategoryType {
  categoryName: string;
  categoryDescription: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrganizationCategoryInitialState {
  category: IOrganizationCategoryType[];
  status: Status;
  error: string | null;
}
