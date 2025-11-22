import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function HeroSection() {
  return (
    <div className="w-full flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="rounded-xl overflow-hidden shadow-lg max-h-[400px]"
        >
          <SwiperSlide>
            <img
              src="/Rev.png"
              alt="slide"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/Food.png"
              alt="slide"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/Beauty.png"
              alt="slide"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}