import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import organizationSlice from "./organization/organization-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    organization: organizationSlice,
  },
});


// react-reduxt --> hooks --> useDispacth, useSelector

export type AppDispacth = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
