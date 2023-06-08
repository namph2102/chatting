import { ModelProvider } from "../Ui";

import { BiMicrophoneOff, BiUserPlus, BiVolumeFull } from "react-icons/bi";
import "./webmedia.scss";
import { BsTelephoneFill } from "react-icons/bs";
import { deFaultIconSize } from "../../servies/utils";

const CallVoices = () => {
  return (
    <ModelProvider>
      <section
        onClick={(e) => e.stopPropagation()}
        className="bg-aside-600 border-main/10 lg:min-w-[400px] w-[320px] pt-8 rounded-xl flex flex-col items-center justify-between "
      >
        <img
          width="90"
          height="90"
          alt="Avatar of the author"
          className="rounded-full border-4 border-aside"
          src={`/images/avata.jpg`}
        />
        <article className="somedia flex gap-3 my-4 mb-12">
          <button className="p-4 sunshine-effect   bg-aside/60 rounded-full ">
            <BiMicrophoneOff fontSize={deFaultIconSize} />
          </button>
          <button className="p-4 sunshine-effect  bg-aside/60 rounded-full ">
            <BiVolumeFull fontSize={deFaultIconSize} />
          </button>
          <button className="p-4 sunshine-effect  bg-aside/60 rounded-full ">
            <BiUserPlus fontSize={deFaultIconSize} />
          </button>
        </article>

        <article className="bg-main/30 py-10 w-full text-center relative">
          <h6>Hoài Nam</h6>
          <button className="w-[56px] h-[56px] hover:bg-red-400 flex items-center justify-center absolute  sunshine_call-effect -top-6 left-1/2 -translate-x-1/2 rounded-full bg-red-600">
            <BsTelephoneFill fontSize={20} className="fill-[#fff] " />
          </button>
        </article>
      </section>
    </ModelProvider>
  );
};

export default CallVoices;
