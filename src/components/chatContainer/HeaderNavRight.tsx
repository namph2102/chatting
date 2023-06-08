import { useRef, useState } from "react";
import {
  BiDotsVerticalRounded,
  BiInfoCircle,
  BiMicrophoneOff,
  BiPhoneCall,
  BiSearch,
  BiTrash,
  BiUser,
  BiVideo,
} from "react-icons/bi";
import { RiCloseFill } from "react-icons/ri";
import { cn, deFaultIconSize } from "../../servies/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { setIsopenCallvideo } from "../../redux/Slice/AccountSlice";
const HeaderNavRight = () => {
  const dispatchRedux: AppDispatch = useDispatch();
  const [isOpenMenuDrop, setIsOpenMenuDrop] = useState<boolean>(false);
  const handleOpenvideoCall = () => {
    dispatchRedux(setIsopenCallvideo(true));
  };
  // Setting open or turn of menu
  const searchComentRef = useRef<HTMLInputElement>(null);
  const SearchcontentBox = useRef<HTMLDivElement>(null);
  const [isOpenSearch, setIsOpenMenuSearch] = useState<boolean>(true);

  const handleOpenDropSettingMenu = () => {
    setIsOpenMenuDrop(!isOpenMenuDrop);
  };
  const handleToggleSearchComment = () => {
    SearchcontentBox.current?.classList.toggle("hidden");
    setIsOpenMenuSearch(!isOpenSearch);
    if (searchComentRef.current?.value) {
      searchComentRef.current.value = "";
    }
  };
  return (
    <ul className="flex gap-4 sm:text-base text-lg cursor-pointer">
      <li className="relative sm:full ">
        {isOpenSearch ? (
          <BiSearch
            onClick={handleToggleSearchComment}
            fontSize={deFaultIconSize}
          />
        ) : (
          <RiCloseFill
            onClick={handleToggleSearchComment}
            fontSize={deFaultIconSize}
            className="z-10"
          />
        )}

        <div
          ref={SearchcontentBox}
          onClick={handleToggleSearchComment}
          className="fixed   inset-0 sm:z-20 z-[1] hidden "
        >
          <div className="mt-16 w-full   flex  justify-center lg:justify-end">
            <input
              ref={searchComentRef}
              type="text"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-[90%]  sm:w-[360px]  h-10  lg:mr-[200px] text-sm  outline-0 border-[1px] form-control py-3 px-2 rounded-lg"
              )}
              placeholder="Tìm kiếm nội dung chat ..."
            />
          </div>
        </div>
      </li>
      <li
        onClick={handleOpenvideoCall}
        className="sm:block hidden"
        title="Call"
      >
        <BiPhoneCall fontSize={deFaultIconSize} />
      </li>
      <li
        onClick={handleOpenvideoCall}
        className="sm:block hidden"
        title="Video"
      >
        <BiVideo fontSize={deFaultIconSize} />
      </li>

      <li className="sm:block hidden" title="Infomation">
        <BiInfoCircle fontSize={deFaultIconSize} />
      </li>
      <li onClick={handleOpenDropSettingMenu} className="relative">
        <BiDotsVerticalRounded fontSize={deFaultIconSize} />
        <ul
          id="dropdown"
          className={cn(
            "absolute top-[calc(100%+6px)] right-0  bg-follow-darkmode   sm:text-sm text-base  py-3 z-10  rounded-lg  w-44 shadow-sm ",
            isOpenMenuDrop ? "" : "hidden"
          )}
        >
          <li className="flex gap-2 sm:hidden px-6 py-1  drop_menu-hover font-medium cursor-pointer justify-between">
            <span>View Profile</span> <BiUser fontSize="1rem" />
          </li>
          <li
            onClick={handleOpenvideoCall}
            className="flex gap-2 sm:hidden px-6 py-1  drop_menu-hover font-medium cursor-pointer justify-between"
          >
            <span>Audio</span> <BiPhoneCall fontSize="1rem" />
          </li>
          <li
            onClick={handleOpenvideoCall}
            className="flex gap-2 sm:hidden px-6 py-1  drop_menu-hover font-medium cursor-pointer justify-between"
          >
            <span>Video</span> <BiVideo fontSize="1rem" />
          </li>

          <li className="flex gap-2 px-6 py-1  drop_menu-hover font-medium cursor-pointer justify-between">
            <span>Muted</span> <BiMicrophoneOff fontSize="1rem" />
          </li>
          <li className="flex gap-2 px-6 py-1  drop_menu-hover font-medium cursor-pointer justify-between">
            <span>Delete</span> <BiTrash fontSize="1rem" />
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default HeaderNavRight;
