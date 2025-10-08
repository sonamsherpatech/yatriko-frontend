import { Status } from "@/lib/types";

export interface IOrganizationType {
  organizationName: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationPhoneNumber: string;
  organizationVatNo?: string;
  organizationPanNo?: string;
  organizationLogo: string | File;
}

export interface IOrganizationInitialState {
  organization: IOrganizationType;
  status: Status;
  error: string | null;
}
