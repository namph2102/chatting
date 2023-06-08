import React, { FC, useState } from "react";
interface ModelProviderProps {
  children: React.ReactNode;
}
const ModelProvider: FC<ModelProviderProps> = ({ children }) => {
  const [isOpenModel, setIsOpenModel] = useState<boolean>(true);

  return (
    <div
      onClick={() => setIsOpenModel(!isOpenModel)}
      className={`fixed modal_container text-[#fff] inset-0 bg-black/70 flex justify-center z-50 items-center ${
        isOpenModel ? "block" : "hidden"
      }`}
    >
      <div>{children}</div>
    </div>
  );
};

export default ModelProvider;
