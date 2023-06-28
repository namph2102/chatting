import { FC, useEffect, useRef, useState } from "react";
import ModelProvider from "./ModelProvider";

import {
  CapitalizeString,
  ToastNotify,
  handleStopPropagation,
} from "../../servies/utils";
import Select from "react-select";
import { optionsPropsSelect } from "../AppInfomation/AppInfomation";
import instance from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import { updateIsOpenFormRoom } from "../../redux/Slice/ChatPersonSlice";
import { BiXCircle } from "react-icons/bi";

interface AddFriendProps {
  idBG: string;
  handleCallback: (nameRoom: string, listAdd: optionsPropsSelect[]) => void;
}

const AddFriend: FC<AddFriendProps> = ({ idBG, handleCallback }) => {
  const [options, setListOptions] = useState<optionsPropsSelect[]>([]);
  const account = useSelector((state: RootState) => state.userStore.account);
  useEffect(() => {
    if (!account._id) return;
    (async () => {
      await instance
        .post("/user/search", {
          listUserExtended: [account._id],
          search: "getall",
        })
        .then((res) => res.data?.listUserSearchs || [])
        .then((listAccount) => {
          const newOptions: optionsPropsSelect[] = listAccount.map(
            (user: any) => ({
              value: user._id,
              label: CapitalizeString(user.fullname),
            })
          );
          setListOptions(newOptions);
        });
    })();
  }, [account._id]);
  const [selectedOption, setSelectedOption] = useState<optionsPropsSelect[]>(
    []
  );
  const handleUploadOption: any = setSelectedOption;
  const roomRef = useRef<HTMLInputElement>(null);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: idBG != "light-mode" ? "#262626" : "#F1F1F1",
      color: "#111111",
    }),
  };
  const dispacth: AppDispatch = useDispatch();
  const handleSubmitRoom = () => {
    if (roomRef.current) {
      if (!roomRef.current.value) {
        ToastNotify("Vui lòng đặt tên phòng").error();
      }
      handleCallback(roomRef.current.value, selectedOption || []);
      handleTurnOffModalAdd();
    }
  };
  const handleTurnOffModalAdd = () => {
    dispacth(updateIsOpenFormRoom(false));
  };
  return (
    <ModelProvider>
      <article
        id={idBG}
        onClick={handleStopPropagation}
        className="md:w-[600px] min-w-[340px] sm:min-w-[500px] px-2 bg-aside py-10 relative  rounded-lg "
      >
        <section className="p-2 flex justify-between">
          <h6 className=" font-semibold text-2xl text-center flex-1">
            Tạo phòng
          </h6>
          <button
            onClick={handleTurnOffModalAdd}
            className="handleModel text-4xl absolute top-2 right-2 hover:text-red-500"
          >
            <BiXCircle />
          </button>
        </section>

        <label className="text-base" htmlFor="room_name">
          Tên Phòng
        </label>
        <section className="flex justify-between mt-2 mb-3 px-3 text-sm text-text   border-[1px] bg-aside  rounded-lg">
          <input
            ref={roomRef}
            type="text"
            id="room_name"
            className="block bg-none outline-none w-full py-2 px-2  bg-transparent text-sm"
            placeholder="Nhập tên phòng"
            required
          />
        </section>

        <h5 className="text-base mb-4">Thêm người vào phòng</h5>
        <div className="text-black">
          <Select
            value={selectedOption}
            onChange={handleUploadOption}
            placeholder="Tìm kiếm..."
            className="react-select-container"
            classNamePrefix="react-select"
            name="colors"
            isMulti
            styles={customStyles}
            options={options}
          />
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleSubmitRoom}
            className="py-2 px-5 background-primary background-primary-hover rounded-xl"
          >
            Xác nhận
          </button>
        </div>
      </article>
    </ModelProvider>
  );
};

export default AddFriend;
