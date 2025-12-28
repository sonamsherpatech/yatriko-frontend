export interface IInterfaceOrganizationType {
  organizationName: string;
  organizationEmail: string;
  organizationPhoneNumber: string;
  organizationAddress: string;
  organizationLogo: File | string;
}

export interface IInterfaceOrganizationPanAndVat
  extends IInterfaceOrganizationType {
  organizationPanNo: string;
  organizationVatNo: string;
  createdAt: string;
}
