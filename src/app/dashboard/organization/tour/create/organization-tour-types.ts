export interface IOrganizationTourType {
  tourTitle: string;
  tourDescription: string;
  tourNumberOfPeople: string;
  tourPrice: string;
  tourPhoto?: File | string;
  tourDuration: string;
  tourStartDate: string;
  tourEndDate: string;
  categoryIds: string[];
}
