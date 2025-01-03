import React from "react";
import { useToastContext } from "../context/ToastContext";

const Toast: React.FC = () => {
  const { toasts } = useToastContext(); // Toast 메시지 리스트

  return (
    <div
      style={{ position: "fixed", bottom: "10px", left: "10px", zIndex: 999 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            maxWidth: "300px",
            width: "100%",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
