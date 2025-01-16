import React, { useRef, useState } from 'react';
import styles from "./Banner.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';



function Banner(){


    return(
        <div className={styles.container}>

    <Swiper 
    navigation={true} 
    autoplay={{
          delay: 2500,
          disableOnInteraction: false,
    }} 
    modules={[Autoplay,Navigation]} 
    className={styles.banner}>
        <SwiperSlide  className={styles.banner}><img
          src="https://corredorsolidario.baluxpet.com.br/wp-content/uploads/2018/02/banner-site.jpg"
          alt=""/>
        </SwiperSlide>
        
    </Swiper>
        
      </div>
    )

}

export default Banner