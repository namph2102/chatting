import { BiLoader } from "react-icons/bi";

const LoadingContainer = () => {
  return (
    <div className="absolute  z-20 inset-0 flex items-center justify-center">
      <BiLoader
        className="text-primary animate-spin duration-[4000]"
        fontSize={35}
      />
    </div>
  );
};

export default LoadingContainer;
