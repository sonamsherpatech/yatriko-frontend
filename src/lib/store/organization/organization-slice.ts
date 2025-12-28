import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationInitialState,
  IOrganizationType,
} from "./organization-slice-types";
import { Status } from "@/lib/types";
import { AppDispatch } from "../store";
import API from "@/lib/http";
import { IInterfaceOrganizationType } from "@/app/(public)/create-organization/organization-types";
const initialState: IOrganizationInitialState = {
  organization: [],
  status: Status.IDLE,
  error: null,
};

const organizationSlice = createSlice({
  name: "organizationSlice",
  initialState: initialState,
  reducers: {
    setOrganization(
      state: IOrganizationInitialState,
      action: PayloadAction<IOrganizationType[]>
    ) {
      state.organization = action.payload;
    },
    setEditOrganization(
      state: IOrganizationInitialState,
      action: PayloadAction<{
        id: string;
        data: IOrganizationType;
      }>
    ) {
      const id = action.payload.id;
      const updatedData = action.payload.data;
      const index = state.organization.findIndex((org) => org.id === id);
      if (index != -1) {
        state.organization[index] = {
          ...state.organization[index],
          ...updatedData,
        };
      }
    },
    setStatus(state: IOrganizationInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setError(
      state: IOrganizationInitialState,
      action: PayloadAction<string | null>
    ) {
      state.error = action.payload;
    },
    resetStatus(state: IOrganizationInitialState) {
      state.status = Status.IDLE;
      state.error = null;
    },
  },
});

export const {
  setOrganization,
  setEditOrganization,
  setStatus,
  setError,
  resetStatus,
} = organizationSlice.actions;
export default organizationSlice.reducer;

//1. API to create ORGANIZATION
export function createOrganization(data: IOrganizationType) {
  return async function createOrganizationThunk(dispatch: AppDispatch) {
    dispatch(resetStatus());
    try {
      //Form data for file upload
      const formData = new FormData();
      formData.append("organizationName", data.organizationName);
      formData.append("organizationAddress", data.organizationAddress);
      formData.append("organizationPhoneNumber", data.organizationPhoneNumber);
      formData.append("organizationEmail", data.organizationEmail);

      if (data.organizationLogo) {
        formData.append("organizationLogo", data.organizationLogo);
      }

      if (data.organizationPanNo) {
        formData.append("organizationPanNo", data.organizationPanNo);
      }
      if (data.organizationVatNo) {
        formData.append("organizationVatNo", data.organizationVatNo);
      }

      const response = await API.post("/organization", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setOrganization(response.data.data));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to create organization"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to create organization"
        )
      );
    }
  };
}

// 2. API call to get organization details
export function getOrganizationDetail() {
  return async function getOrganizationDetailThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));

    try {
      const response = await API.get("/organization");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        response.data.data.length > 0 &&
          dispatch(setOrganization(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch organization"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch organization"
        )
      );
    }
  };
}

// 3. API call to update organization data
export function updateOrganization(
  id: string,
  updatedOrganizationData: IInterfaceOrganizationType
) {
  return async function updateOrganizationThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append(
        "organizationName",
        updatedOrganizationData.organizationName
      );
      formData.append(
        "organizationAddress",
        updatedOrganizationData.organizationAddress
      );
      formData.append(
        "organizationPhoneNumber",
        updatedOrganizationData.organizationPhoneNumber
      );
      formData.append(
        "organizationEmail",
        updatedOrganizationData.organizationEmail
      );

      // Handle logo - could be File object or existing path
      if (updatedOrganizationData.organizationLogo) {
        if (updatedOrganizationData.organizationLogo instanceof File) {
          formData.append(
            "organizationLogo",
            updatedOrganizationData.organizationLogo
          );
        }
        // If it's already a string (existing path), backend will handle it
      }

      const response = await API.patch(
        `/organization`, // Include ID in URL path
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        dispatch(setEditOrganization({ id: id, data: response.data.data }));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to update organization"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to update organization"
        )
      );
    }
  };
}
