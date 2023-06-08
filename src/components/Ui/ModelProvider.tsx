import React, { FC } from "react";
interface ModelProviderProps {
  children: React.ReactNode;
  setIsCloseModal: () => void;
}
const ModelProvider: FC<ModelProviderProps> = ({
  children,
  setIsCloseModal,
}) => {
  return (
    <div
      onClick={() => setIsCloseModal()}
      className={`fixed modal_container text-[#fff] inset-0 bg-black/70 flex justify-center z-50 items-center`}
    >
      <div>{children}</div>
    </div>
  );
};

export default ModelProvider;
