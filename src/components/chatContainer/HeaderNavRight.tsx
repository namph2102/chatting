import { BiInfoCircle, BiPhoneCall, BiVideo } from "react-icons/bi";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { setIsopenCallvideo } from "../../redux/Slice/AccountSlice";
const HeaderNavRight = () => {
  const dispatchRedux: AppDispatch = useDispatch();

  const handleOpenvideoCall = () => {
    dispatchRedux(setIsopenCallvideo(true));
  };

  return (
    <ul className="flex gap-4 text-2xl  cursor-pointer">
      <li onClick={handleOpenvideoCall} title="Call">
        <BiPhoneCall />
      </li>
      <li onClick={handleOpenvideoCall} title="Video">
        <BiVideo />
      </li>

      <li>
        <BiInfoCircle />
      </li>
    </ul>
  );
};

export default HeaderNavRight;
