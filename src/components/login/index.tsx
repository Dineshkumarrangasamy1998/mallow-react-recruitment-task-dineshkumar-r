import React from "react";
import { Button, Card, Checkbox, Col, Flex, Form, Input, Row } from "antd";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import { LockOutlined } from "@ant-design/icons";
import { handleLogin } from "../../services/login-services";
import FullPageLoader from "../common/Loader";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigate();
  const [form] = Form.useForm();

  // form submit
  const onFinish = (values: any) => {
    setLoading(true);
    handleLogin(values)
      .then(() => {
        setLoading(false);
        navigation("/users");
      })
      .catch(() => setLoading(false));
  };
  
  return (
    <React.Fragment>
      <FullPageLoader visible={loading} />
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", background: "#f5f5f5" }}
      >
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card
            title=""
            variant="borderless"
            style={{ width: "fit-content", margin: "auto" }}
          >
            <Form
              form={form}
              name="horizontal_login"
              layout="inline"
              onFinish={onFinish}
              initialValues={{ remember: true }}
              style={{ width: "100%", margin: "auto", gap: "20px" }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Username is required" },
                  {
                    pattern: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Username must be a valid email format",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  {
                    pattern: /^[A-Za-z0-9]{8,}$/,
                    message:
                      "Password must be at least 8 characters, letters/numbers only",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="flex-start" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                </Flex>
              </Form.Item>
              <Form.Item style={{ width: "100%" }}>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Login;
