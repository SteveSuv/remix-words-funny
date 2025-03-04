import { Toaster as ReactToaster } from "react-hot-toast";
import { Bell, CheckCircle, CircleAlert } from "lucide-react";
import { colors } from "@heroui/react";
import { LuIcon } from "./LuIcon";

export const Toaster = () => {
  return (
    <ReactToaster
      position="top-center"
      toastOptions={{
        success: {
          icon: <LuIcon icon={CheckCircle} className="ml-2" />,
          style: {
            background: colors.green[600],
          },
        },
        error: {
          icon: <LuIcon icon={CircleAlert} className="ml-2" />,
          style: {
            background: colors.red[500],
          },
        },
        icon: <LuIcon icon={Bell} className="ml-2" />,
        style: {
          background: colors.blue[500],
          color: colors.white,
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 12px",
        },
      }}
    />
  );
};
