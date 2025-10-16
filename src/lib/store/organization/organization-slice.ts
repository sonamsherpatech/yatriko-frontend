import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationInitialState,
  IOrganizationType,
} from "./organization-slice-types";
import { Status } from "@/lib/types";
import { AppDispacth } from "../store";
import API from "@/lib/http";
const initialState: IOrganizationInitialState = {
  organization: {
    organizationAddress: "",
    organizationEmail: "",
    organizationLogo: "",
    organizationName: "",
    organizationPanNo: "",
    organizationPhoneNumber: "",
    organizationVatNo: "",
  },
  status: Status.IDLE,
  error: null,
};

const organizationSlice = createSlice({
  name: "organizationSlice",
  initialState: initialState,
  reducers: {
    setOrganization(
      state: IOrganizationInitialState,
      action: PayloadAction<IOrganizationType>
    ) {
      state.organization = action.payload;
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

export const { setOrganization, setStatus, setError, resetStatus } =
  organizationSlice.actions;
export default organizationSlice.reducer;

//ORGANIZATION THUNK
export function createOrganization(data: IOrganizationType) {
  return async function createOrganizationThunk(dispatch: AppDispacth) {
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
