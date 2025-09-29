import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface UserState {
  users: any[];
  allUsers: any[];
  loading: boolean;
  pagination: Pagination;
  searchText: string;
  gridView: boolean;
}

const initialState: UserState = {
  users: [],
  allUsers: [],
  loading: false,
  pagination: { current: 1, pageSize: 5, total: 0 },
  searchText: "",
  gridView: false,
};

//slice handle here
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserListStart: (state) => {
      state.loading = true;
    },
    fetchUserList: (state, action: PayloadAction<any[]>) => {
      state.allUsers = action.payload;
      state.users = action.payload;
      state.loading = false;
      state.pagination.total = action.payload.length;
    },
    fetchUserListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.users = [];
      state.allUsers = [];
      console.error("Failed to fetch users:", action.payload);
    },
    changeGridView: (state, action: PayloadAction<boolean>) => {
      state.gridView = action.payload;
    },
    changeSearchText: (state, action: PayloadAction<string>) => {
      const q = (action.payload || "").trim().toLowerCase();
      state.searchText = action.payload;
        state.users = state.allUsers.filter((u) => {
          const fn = (u.first_name || "").toString().toLowerCase();
          const ln = (u.last_name || "").toString().toLowerCase();
          const em = (u.email || "").toString().toLowerCase();
          return fn.includes(q) || ln.includes(q) || em.includes(q);
        });
      
      state.pagination.current = 1;
      state.pagination.total = state.users.length;
    },
    changePagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = action.payload;
    },
    disableLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchUserListStart,
  fetchUserList,
  fetchUserListFailure,
  changePagination,
  changeGridView,
  disableLoading,
  changeSearchText,
} = userSlice.actions;
export default userSlice.reducer;
