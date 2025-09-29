import React, { useEffect, useRef } from "react";
import Header from "../header";
import CardUserList from "./card-list";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from "../../store/user/userActions";
import { AppDispatch, RootState } from "../../store/store";
import TableHeader from "./table-header";
import UserList from "./user-list";
import FullPageLoader from "../common/Loader";

const Users: React.FC = () => {
  //initial data load
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.usersReducer);

  const didFetchRef = useRef(false);

  // to avoid multiple fetches using values from store
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    dispatch(
      loadUsers(userState.pagination.current, userState.pagination.pageSize)
    );
  }, [dispatch, userState.pagination]);

  return (
    <div>
      <Header />
      <TableHeader />
      <div
        style={{ padding: 40, backgroundColor: "#f0f2f5", minHeight: "100vh" }}
      >
        {userState.gridView ? <CardUserList /> : <UserList />}
      </div>
      <FullPageLoader visible={userState.loading} />
    </div>
  );
};

export default Users;
