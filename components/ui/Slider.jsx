import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

export default function Slider() {
  const images = [
    "/sliderimg1.webp",
    "/sliderimg2.webp",
    "/sliderimg3.webp",
    "/sliderimg4.webp",
  ];

  return (
    <div className="mx-auto w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[400px] w-full">
              <Image
                fill
                src={src}
                alt={`Slide ${index + 1}`}
                className="h-full w-full rounded-3xl object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
