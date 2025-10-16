import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import organizationSlice from "./organization/organization-slice";
import organizationCategorySlice from "./organization/category/category-slice";
import organizationTourSlice from "./organization/tour/tour-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    organization: organizationSlice,
    organizationCategory: organizationCategorySlice,
    organizationTour: organizationTourSlice,
  },
});

// react-reduxt --> hooks --> useDispacth, useSelector

export type AppDispacth = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
