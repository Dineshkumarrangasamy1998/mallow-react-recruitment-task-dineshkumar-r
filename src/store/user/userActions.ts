import axiosInstance from "../../services/interceptors";
import Endpoints from "../../utils/endpoints";
import {
  fetchUserList,
  fetchUserListFailure,
  fetchUserListStart,
} from "./userSlice";
import { changePagination } from "./userSlice";
import { AppDispatch } from "../store";

//load user data
export const loadUsers =
  (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    dispatch(fetchUserListStart());
    try {
      const res = await axiosInstance.get(Endpoints.users, {
        params: { page: page, per_page: pageSize },
      });
      dispatch(fetchUserList(res.data.data));
      dispatch(
        changePagination({
          current: page,
          pageSize,
          total: res.data.total ?? res.data.data.length,
        })
      );
    } catch (error: any) {
      dispatch(fetchUserListFailure(error.message));
    }
  };
