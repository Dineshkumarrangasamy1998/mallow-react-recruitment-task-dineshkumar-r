import { Button, Flex, Form, Input, Radio } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { TableOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import {
  changeGridView,
  changeSearchText,
} from "../../../store/user/userSlice";
import { loadUsers } from "../../../store/user/userActions";
import CreateUser from "../create-user";
import { useDebounce } from "use-debounce";
import Constants from "../../../utils/constants";

const { Search } = Input;

const TableHeader: React.FC = () => {
  const [tableLayout, setTableLayout] = React.useState<"table" | "card">(
    "table"
  );
  const [visible, setVisible] = React.useState(false);
  const [searchText, setSearchText] = useState<string>("");

  //implemented debounce for searchText
  const [debouncedSearch] = useDebounce(searchText, Constants.DEBOUNCE_DELAY);
  const skipNextDebounce = useRef(false);

  const userState = useSelector((state: RootState) => state.usersReducer);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    userState.gridView ? setTableLayout("card") : setTableLayout("table");
  }, [userState.gridView]);

  useEffect(() => {
    if (skipNextDebounce.current) {
      skipNextDebounce.current = false;
      return;
    }
    dispatch(changeSearchText(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleTableLayoutChange = (e: any) => {
    const newLayout = e.target.value;
    setTableLayout(newLayout);
    dispatch(changeGridView(newLayout === "card"));
  };

  const onSearch = (value: string) => {
    dispatch(changeSearchText(value));
    if (!value) {
      dispatch(loadUsers(1, userState.pagination.pageSize ?? 5));
    }
  };

  const onSearchImmediate = (value: string) => {
    skipNextDebounce.current = true;
    setSearchText(value);
    onSearch(value);
  };

  const onCreateNewUser = (value: boolean) => {
    setVisible(value);
  };

  return (
    <React.Fragment>
      <Flex
        justify="space-between"
        align="center"
        style={{ padding: 20, backgroundColor: "#fff" }}
      >
        <h2>Users</h2>
        <Flex gap={10}>
          <Search
            placeholder="Search users"
            onSearch={onSearchImmediate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value)
            }
            enterButton
            allowClear
            style={{ maxWidth: 300 }}
            value={searchText}
          />
          <Button type="primary" onClick={() => onCreateNewUser(true)}>
            Add User
          </Button>
        </Flex>
      </Flex>
      <Flex
        justify="flex-start"
        align="center"
        style={{ paddingRight: 20, paddingLeft: 20 }}
      >
        <Form.Item>
          <Radio.Group value={tableLayout} onChange={handleTableLayoutChange}>
            <Radio.Button value="table">
              <TableOutlined /> Table
            </Radio.Button>
            <Radio.Button value="card">
              <UnorderedListOutlined /> Card
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Flex>
      <CreateUser
        isVisible={visible}
        handleModalClose={() => setVisible(false)}
      />
    </React.Fragment>
  );
};

export default TableHeader;
