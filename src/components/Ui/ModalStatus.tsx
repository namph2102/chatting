import { FC } from "react";
import ModelProvider from "./ModelProvider";
import { BsXLg } from "react-icons/bs";
import { deFaultIconSize, handleStopPropagation } from "../../servies/utils";
interface ModalStatusProps {
  callBackStatus: (isSucess: boolean) => void;
  title: string;
}
const ModalStatus: FC<ModalStatusProps> = ({ callBackStatus, title }) => {
  return (
    <ModelProvider>
      <article
        onClick={handleStopPropagation}
        className="relative py-8 px-12 text-[#ffff] bg-[#131720] rounded-lg shadow dark:bg-gray-700"
      >
        <button
          type="button"
          onClick={() => callBackStatus(false)}
          className="absolute top-3 right-2.5 text-gray-200 hover:text-gray-500 bg-transparent"
          data-modal-hide="popup-modal"
        >
          <BsXLg fontSize={deFaultIconSize} />
        </button>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold">Thông Báo</h2>
          <p className="mb-5 text-lg font-normal my-4">{title}?</p>
          <div className="flex gap-3">
            <button
              onClick={() => callBackStatus(true)}
              data-modal-hide="popup-modal"
              type="button"
              className="text-white bg-main/90 hover:bg-main/60   font-medium rounded-full text-sm basis-5/6 px-5 py-2.5 "
            >
              Đồng ý
            </button>
            <button
              onClick={() => callBackStatus(false)}
              data-modal-hide="popup-modal"
              type="button"
              className="bg-[#fff] hover:bg-[#dddddd]  text-black font-medium rounded-full text-sm  basis-5/6 px-5 py-2.5 "
            >
              Từ chối
            </button>
          </div>
        </div>
      </article>
    </ModelProvider>
  );
};

export default ModalStatus;
