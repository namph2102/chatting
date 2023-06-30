import React, { FC } from "react";
import { handleStopPropagation } from "../../servies/utils";

interface ModalProviderOverlayProps {
  children: React.ReactNode;
  setIsCloseModal: () => void;
}
const ModalProviderOverlay: FC<ModalProviderOverlayProps> = ({
  children,
  setIsCloseModal,
}) => {
  return (
    <div
      onClick={() => setIsCloseModal()}
      className={`fixed modal_container text-[#fff] bg-black/80   inset-0  flex justify-center z-[9999] items-center w-screen h-screen`}
    >
      <div onClick={handleStopPropagation}>{children}</div>
    </div>
  );
};

export default ModalProviderOverlay;
