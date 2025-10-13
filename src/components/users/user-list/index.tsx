import React, { useEffect, useState } from "react";
import { Table, Space, Flex, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import Paginator from "../../common/Paginator";
import { User } from "../../../model/userType";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import CreateUser from "../create-user";
import {
  disableLoading,
  fetchUserListStart,
} from "../../../store/user/userSlice";
import { deleteUser } from "../../../services/user-services";
import { loadUsers } from "../../../store/user/userActions";
import { useAppNotification } from "../../../hooks/notification";

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  //get the user state from the redux store
  const userState = useSelector((state: RootState) => state.usersReducer);
  const dispatch = useDispatch<AppDispatch>();

  const { contextHolder, open } = useAppNotification();

  useEffect(() => {
    setData(userState.users);
  }, [userState]);

  //open the edit modal and set the selected user id
  const handleEdit = (id: number) => {
    setVisible(true);
    setSelectedUserId(id);
  };

  //delete the user based on id
  const handleDelete = (id: number) => {
    dispatch(fetchUserListStart());
    deleteUser(id)
      .then(() => {
        open("success", {
          message: "User deleted successfully",
          description: `User with ID ${id} has been deleted.`,
        });
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

  // handle table change for sorting
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (!sorter || !sorter.order) {
      setData(userState.users);
      return;
    }

    const field = (sorter.field as keyof User) || sorter.columnKey;
    const order = sorter.order; // 'ascend' | 'descend'

    const sorted = [...userState.users].sort((a, b) => {
      const aVal = (a[field] ?? "") as any;
      const bVal = (b[field] ?? "") as any;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.toLowerCase().localeCompare(bVal.toLowerCase());
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return aVal - bVal;
      }
      return String(aVal).localeCompare(String(bVal));
    });

    if (order === "descend") sorted.reverse();
    setData(sorted);
  };

  const columns: ColumnsType<User> = [
    {
      title: "",
      dataIndex: "avatar",
      render: (url: string) => (
        <img
          src={url}
          alt="avatar"
          style={{ width: 40, borderRadius: "50%", marginLeft: 60 }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      render: (text, record) => (
        <div
          style={{ color: "blue", cursor: "pointer" }}
        >{`${record.email}`}</div>
      ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: true,
      render: (text, record) => <div>{`${record.first_name}`}</div>,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: true,
      render: (text, record) => <div>{`${record.last_name}`}</div>,
    },
    {
      title: "Action",
      sorter: false,
      dataIndex: "id",
      render: (id: number) => (
        <Flex justify="center" align="center" gap={10}>
          <Button type="primary" onClick={() => handleEdit(id)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {/* render the notification context holder once inside your component tree */}
      {contextHolder}
      <Table<User>
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        onChange={handleTableChange}
      />
      <Flex justify="flex-end" align="center">
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

export default UserList;
