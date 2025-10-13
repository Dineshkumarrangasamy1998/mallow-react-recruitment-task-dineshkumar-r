import React, { useEffect, useState } from "react";
import { Space, Flex, Button } from "antd";
import Paginator from "../../common/Paginator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteUser } from "../../../services/user-services";
import { loadUsers } from "../../../store/user/userActions";
import {
  disableLoading,
  fetchUserListStart,
} from "../../../store/user/userSlice";
import CreateUser from "../create-user";
import { User } from "../../../model/userType";
import { useAppNotification } from "../../../hooks/notification";

const CardUserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const userState = useSelector((state: RootState) => state.usersReducer);
  const dispatch = useDispatch<AppDispatch>();
  const { contextHolder, open } = useAppNotification();

  useEffect(() => {
    setData(userState.users);
  }, [userState]);

  //handled edit based on id and API
  const handleEdit = (id: number) => {
    setVisible(true);
    setSelectedUserId(id);
  };

  //handled delete based on id
  const handleDelete = (id: number) => {
    dispatch(fetchUserListStart());
    deleteUser(id)
      .then(() => {
        open("success", { message: "User deleted successfully" });
        dispatch(
          loadUsers(userState.pagination.current, userState.pagination.pageSize)
        );
      })
      .catch((error) => {
        open("error", { message: "Error deleting user" });
        console.error("Error deleting user:", error);
      })
      .finally(() => {
        dispatch(disableLoading());
      });
  };

  return (
    <Space
      direction="vertical"
      style={{ padding: 20, backgroundColor: "#f0f2f5", width: "100%" }}
      size="large"
    >
      {contextHolder}
      <Flex wrap="wrap" gap={30} justify="center">
        {data.map((user) => (
          <div
            key={user.id}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 400,
              textAlign: "center",
              position: "relative",
            }}
          >
            <div>
              <img
                src={user.avatar}
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <h3>{`${user.first_name} ${user.last_name}`}</h3>
              <p>{user.email}</p>
            </div>
            <div className="card-hover">
              <Flex
                justify="center"
                align="center"
                gap={10}
                style={{ marginTop: 10 }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  onClick={() => handleEdit(user.id)}
                  style={{ backgroundColor: "#b37feb" }}
                  icon={<EditOutlined />}
                />
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  size="large"
                  onClick={() => handleDelete(user.id)}
                  icon={<DeleteOutlined />}
                />
              </Flex>
            </div>
          </div>
        ))}
      </Flex>
      <Flex justify="flex-end" align="center" style={{ padding: 20 }}>
        <Paginator />
      </Flex>
      <CreateUser
        isVisible={visible}
        handleModalClose={() => setVisible(false)}
        userData={selectedUserId}
      />
    </Space>
  );
};

export default CardUserList;
