import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [idCounter, setIdCounter] = useState<number>(0);

  const addToast = (message: string) => {
    setIdCounter((prevId) => prevId + 1);
    const newToast: Toast = {
      id: idCounter,
      message,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // 3초 후 팝업 제거
    setTimeout(() => {
      removeToast(newToast.id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              maxWidth: "300px",
              opacity: 1,
              transition: "opacity 0.3s",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
