import { FC } from "react";
import Backdrop from "@mui/material/Backdrop";
import { BiLoader } from "react-icons/bi";
interface LoaddingOverLayProps {
  ishandleTouchClose?: boolean;
  className?: string;
}
const LoaddingOverLay: FC<LoaddingOverLayProps> = ({ className = "" }) => {
  return (
    <div className={className || ""}>
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <BiLoader className="animate-spin duration-[4000]" fontSize={35} />
      </Backdrop>
    </div>
  );
};
export default LoaddingOverLay;
