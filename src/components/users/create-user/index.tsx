import React, { useEffect, useState, useCallback } from "react";
import { Button, Flex, Form, Input, Modal } from "antd";
import { createUser } from "../../../services/login-services";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { loadUsers } from "../../../store/user/userActions";
import axiosInstance from "../../../services/interceptors";
import {
  disableLoading,
  fetchUserListStart,
} from "../../../store/user/userSlice";
import Endpoints from "../../../utils/endpoints";
import { CreateUserProps, UserPayload } from "../../../model/userType";

const CreateUser: React.FC<CreateUserProps> = ({
  isVisible,
  handleModalClose,
  userData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  //callback for dependency
  const getUserById = useCallback(
    (id: number) => {
      dispatch(fetchUserListStart());
      axiosInstance
        .get(`${Endpoints.users}/${id}`)
        .then((response) => {
          const user = response.data.data;
          form.setFieldsValue({
            fname: user.first_name,
            lname: user.last_name,
            email: user.email,
            profileUrl: user.avatar,
          });
        })
        .finally(() => {
          dispatch(disableLoading());
        });
    },
    [dispatch, form]
  );

  useEffect(() => {
    setIsModalOpen(isVisible);
    if (userData && isVisible) {
      setIsEditMode(true);
      getUserById(userData);
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
  }, [isVisible, userData, getUserById, form]);

  //after form submit based the editMode state, if update / new
  const finished = (values: any) => {
    dispatch(fetchUserListStart());
    let payload: UserPayload = {
      email: values.email,
      first_name: values.fname,
      last_name: values.lname,
      avatar: values.profileUrl,
    };
    if (isEditMode) {
      payload = { ...payload, id: userData ?? undefined };
      axiosInstance
        .put(`${Endpoints.users}/${userData}`, payload)
        .then((response) => {
          if (response && response.data) {
            dispatch(loadUsers(1, 5));
          }
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        })
        .finally(() => {
          dispatch(disableLoading());
          setIsModalOpen(false);
          handleModalClose();
          form.resetFields();
        });
    } else {
      createUser(payload)
        .then((response) => {
          if (response && response.data) {
            dispatch(loadUsers(1, 5));
          }
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        })
        .finally(() => {
          dispatch(disableLoading());
          setIsModalOpen(false);
          handleModalClose();
          form.resetFields();
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleModalClose();
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={isEditMode ? "Edit User" : "Create New User"}
        open={isModalOpen}
        forceRender
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={finished}
        >
          {/* First Name */}
          <Form.Item
            name="fname"
            label="First Name"
            normalize={(v) => (typeof v === "string" ? v.trim() : v)}
            rules={[
              { required: true, message: "Please enter first name" },
              { min: 2, message: "First name must be at least 2 characters" },
              { max: 50, message: "First name cannot exceed 50 characters" },
              {
                pattern: /^[A-Za-z\s.'-]+$/,
                message: "First name contains invalid characters",
              },
            ]}
          >
            <Input placeholder="Please enter first name" maxLength={50} />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            name="lname"
            label="Last Name"
            normalize={(v) => (typeof v === "string" ? v.trim() : v)}
            rules={[
              { required: true, message: "Please enter last name" },
              { min: 1, message: "Last name must be at least 1 character" },
              { max: 50, message: "Last name cannot exceed 50 characters" },
              {
                pattern: /^[A-Za-z\s.'-]+$/,
                message: "Last name contains invalid characters",
              },
            ]}
          >
            <Input placeholder="Please enter last name" maxLength={50} />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            normalize={(v) => (typeof v === "string" ? v.trim() : v)}
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Please enter email" maxLength={254} />
          </Form.Item>

          {/* Profile Image Url */}
          <Form.Item
            name="profileUrl"
            label="Profile Image Url"
            normalize={(v) => (typeof v === "string" ? v.trim() : v)}
            rules={[
              { required: true, message: "Please enter profile image URL" },
              {
                validator: (_, value) => {
                  if (!value)
                    return Promise.reject(
                      new Error("Please enter profile image URL")
                    );
                  try {
                    const u = new URL(value);
                    if (u.protocol === "http:" || u.protocol === "https:") {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("URL must start with http:// or https://")
                    );
                  } catch {
                    return Promise.reject(
                      new Error("Please enter a valid URL")
                    );
                  }
                },
              },
            ]}
          >
            <Input
              placeholder="Please enter profile image URL"
              maxLength={2048}
            />
          </Form.Item>

          <Flex gap={10} justify="flex-end" align="center">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
