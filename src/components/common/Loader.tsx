import React from "react";
import { Spin, Typography } from "antd";

const { Text } = Typography;

//common loader
export const FullPageLoader: React.FC<{
  visible?: boolean;
  message?: string;
}> = ({ visible = true, message }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.7)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
      }}
      aria-hidden={!visible}
    >
      <Spin size="large" />
      {message ? <Text>{message}</Text> : null}
    </div>
  );
};

export default FullPageLoader;
