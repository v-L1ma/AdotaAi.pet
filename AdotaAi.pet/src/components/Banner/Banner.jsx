import React, { useRef, useState } from 'react';
import styles from "./Banner.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'




function Banner(){


    return(
        <div className={styles.container}>

    <Swiper 
    navigation={true} 
    autoplay={{
          delay: 10500,
          disableOnInteraction: false,
    }} 
    modules={[Autoplay,Navigation]} 
    className={styles.banner}>
        <SwiperSlide className={styles.banner}>
          <img src={banner1} alt="" />
          //images designed by Freepik
        </SwiperSlide>
        <SwiperSlide className={styles.banner}>
          <img src={banner2} alt="" />
          //images designed by Freepik
        </SwiperSlide>
        <SwiperSlide className={styles.banner}>
          <img src={banner3} alt="" />
          //images designed by Freepik
        </SwiperSlide>
        
    </Swiper>
        
      </div>
    )

}

export default Banner