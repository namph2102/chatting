import { Swiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { useEffect, useState } from "react";
const VideoHeader = () => {
  const [swiperEvent, setSwiperEvent] = useState<any>(null);
  useEffect(() => {
    console.log(swiperEvent);
    if (swiperEvent) {
      document
        .querySelector(".swiper-button-next")
        ?.addEventListener("click", () => {
          swiperEvent.slideNext();
        });
      document
        .querySelector(".swiper-button-prev")
        ?.addEventListener("click", () => {
          swiperEvent.slidePrev();
        });
    }
    return () => {
      if (!swiperEvent) return;
      document
        .querySelector(".swiper-button-next")
        ?.removeEventListener("click", () => {
          swiperEvent.slideNext();
        });
      document
        .querySelector(".swiper-button-prev")
        ?.removeEventListener("click", () => {
          swiperEvent.slidePrev();
        });
    };
  }, [swiperEvent]);
  const PersonInViewHeader =
    window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1 || 1;
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={PersonInViewHeader}
      navigation
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => setSwiperEvent(swiper)}
      onSlideChange={(swiper) => setSwiperEvent(swiper)}
    >
      {/* <SwiperSlide>
        <VideoItem />
      </SwiperSlide>
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide>{" "}
      <SwiperSlide>
        <VideoItem />
      </SwiperSlide> */}
    </Swiper>
  );
};

export default VideoHeader;
