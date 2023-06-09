import React, { FC } from "react";
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
      className={`fixed modal_container text-[#fff] inset-0 bg-black/80 flex justify-center z-50 items-center w-screen h-screen`}
    >
      <div>{children}</div>
    </div>
  );
};

export default ModalProviderOverlay;
