import { BiInfoCircle, BiPhoneCall, BiVideo } from "react-icons/bi";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import {
  updateSettingVideoCall,
  updateOpenGroup,
} from "../../redux/Slice/AccountSlice";
import { FC } from "react";
import { PserSonChating } from "../../redux/Slice/ChatPersonSlice";
interface HeaderNavRightProps {
  isChatBot: boolean;
  person: PserSonChating;
}
const HeaderNavRight: FC<HeaderNavRightProps> = ({ isChatBot, person }) => {
  const dispatchRedux: AppDispatch = useDispatch();

  const handleOpenvideoCall = () => {
    dispatchRedux(
      updateSettingVideoCall({
        roomName: person.fullname,
        isOpen: true,
        roomId: person.idRoom,
        type: person.typechat,
      })
    );
  };

  return (
    <ul className="flex gap-4 text-2xl  cursor-pointer">
      <li onClick={handleOpenvideoCall} title="Call">
        <BiPhoneCall />
      </li>
      <li onClick={handleOpenvideoCall} title="Video">
        <BiVideo />
      </li>

      {!isChatBot && (
        <li onClick={() => dispatchRedux(updateOpenGroup("nopayload"))}>
          <BiInfoCircle />
        </li>
      )}
    </ul>
  );
};

export default HeaderNavRight;
