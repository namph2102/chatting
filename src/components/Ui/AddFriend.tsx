import { useRef } from "react";
import ModelProvider from "./ModelProvider";
import { BsSearch, BsXLg } from "react-icons/bs";
import { handleStopPropagation } from "../../servies/utils";

const AddFriend = () => {
  const idModelProvider = useRef(document.getElementById("modal_container"));

  const handleModel = () => {
    idModelProvider.current?.click();
  };
  handleModel();
  return (
    <ModelProvider>
      <article
        onClick={handleStopPropagation}
        className="md:w-[500px] w-full px-5 bg-aside py-6 "
      >
        <section className="p-2 flex justify-between">
          <h6 className=" text-white font-semibold text-lg ">Thêm Người gọi</h6>
          <button className="handleModel">
            <BsXLg fontSize={16} />
          </button>
        </section>
        <section className="flex justify-between m-3 px-3 text-sm text-text border bg-aside  rounded-lg">
          <input
            type="search"
            id="search"
            className="block bg-none outline-none w-full p-3 pl-10  bg-transparent "
            placeholder="Tìm kiếm bạn .. ."
            required
          />
          <label
            htmlFor="search"
            className="flex items-center pl-3 pointer-events-none"
          >
            <BsSearch fontSize={16} className="text-text" />
          </label>
        </section>
        <table>
          <h5 className="text-sm">Danh sách bạn bè</h5>
          <ul>
            <li></li>
          </ul>
        </table>
      </article>
    </ModelProvider>
  );
};

export default AddFriend;
