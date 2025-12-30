export interface IOrganizationTourType {
  tourTitle: string;
  tourDescription: string;
  totalCapacity: string;
  basePrice: string;
  tourPhoto: File | string;
  tourDuration: string;
  tourStartDate: string;
  tourEndDate: string;
  categoryIds: string[];
}
