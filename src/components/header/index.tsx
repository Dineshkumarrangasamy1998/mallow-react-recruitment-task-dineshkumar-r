import { LogoutOutlined } from "@ant-design/icons";
import { Button, Row, Col, Tooltip } from "antd";
import React from "react";
import { logout } from "../../services/login-services";

const Header: React.FC = () => {
  const handleLogout = () => {
    logout();
  };

  //fetch user data
  const userStr = localStorage.getItem("user");
  const userName = userStr ? JSON.parse(userStr) : "User";

  return (
    <header>
      <Row
        justify="end"
        align="middle"
        className="header"
        style={{ padding: 20 }}
      >
        <Col>
          <div className="logout-btn" onClick={() => handleLogout()}>
            <Tooltip title="Logout">
              <span>{userName}</span>
            </Tooltip>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              danger
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            />
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
