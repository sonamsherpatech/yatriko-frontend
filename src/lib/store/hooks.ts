import { useDispatch, useSelector } from "react-redux";
import { AppDispacth, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispacth>();
export const useAppSelector = useSelector.withTypes<RootState>();
