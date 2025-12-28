import { Status } from "@/lib/types";

export interface IOrganizationType {
  id?: string;
  organizationName: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationPhoneNumber: string;
  organizationVatNo?: string;
  organizationPanNo?: string;
  organizationLogo: string | File;
  createdAt: string;
}

export interface IOrganizationInitialState {
  organization: IOrganizationType[];
  status: Status;
  error: string | null;
}
