import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

export default function HeroSection() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      className="w-full max-w-7xl mx-auto mt-3 rounded-xl overflow-hidden"
    >
      <SwiperSlide>
        <img src="/Rev.png" alt="slide 1" className="w-full h-96 object-cover" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/Food.png" alt="slide 2" className="w-full h-96 object-cover" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/Beauty.png" alt="slide 3" className="w-full h-96 object-cover" />
      </SwiperSlide>
    </Swiper>
  );
}