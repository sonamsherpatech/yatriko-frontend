export interface IOrganizationTourType {
  tourName: string;
  tourDescription: string;
  tourNoOfPeople: string;
  tourPrice: string;
  tourPhoto?: File | string;
  tourDuration: string;
  tourStartDate?: Date | string;
  tourEndDate?: Date | string;
}
