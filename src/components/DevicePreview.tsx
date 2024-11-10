import { ReactNode } from "react";
import { PreviewDevice } from "../types/types";

export const DevicePreview = ({
  children,
  device,
}: {
  children: ReactNode;
  device: PreviewDevice;
}) => {
  const getDeviceStyles = () => {
    switch (device) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full max-w-6xl";
    }
  };

  return (
    <div className="flex justify-center w-full overflow-x-auto p-4">
      <div
        className={`${getDeviceStyles()} transition-all duration-300 bg-white shadow-lg rounded-lg`}
      >
        {children}
      </div>
    </div>
  );
};
