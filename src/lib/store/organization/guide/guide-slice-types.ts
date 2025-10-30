import { Status } from "@/lib/types";

export interface IOrganizationGuide {
  id?: string;
  guideName: string;
  guideEmail: string;
  guidePhoneNumber: string;
  guideStatus?: string;
  guideAddress: string;
  guideSalary: number;
  guidePassword?: string;
  guideJoinedDate?: File | string;
  guideImage: string;
  tourId: string;
  createdAt: string;
}

export interface IOrganizationGuideInitialState {
  guide: IOrganizationGuide[];
  status: Status;
  error: null | string;
}
