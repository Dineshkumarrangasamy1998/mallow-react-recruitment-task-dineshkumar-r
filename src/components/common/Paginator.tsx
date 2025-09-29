import React from "react";
import { Pagination } from "antd";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { changePagination } from "../../store/user/userSlice";
import { loadUsers } from "../../store/user/userActions";

// common pagination
const Paginator: React.FC = () => {
  const userState = useSelector((state: RootState) => state.usersReducer);
  const { current, pageSize, total } = userState.pagination;
  const dispatch = useDispatch<AppDispatch>();

  const onHandleChange = (page: number, pageSize?: number) => {
    dispatch(
      changePagination({ current: page, pageSize: pageSize || 5, total: total })
    );
    dispatch(loadUsers(page, pageSize || 5));
  };

  return (
    <div style={{ marginTop: 16, textAlign: "center" }}>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onHandleChange}
        showSizeChanger={false}
        simple={false}
      />
    </div>
  );
};

export default Paginator;
