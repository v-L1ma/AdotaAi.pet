import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import CardPet from "../CardPet";
import { useEffect } from "react";
import api from "../../sevices/api";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import {Pagination, Navigation} from 'swiper/modules';

function Galeria() {

    const [animais, setAnimais] = useState([])
    const token = localStorage.getItem("token")
  
    async function listaAnimais(){
  
      const animaisFromApi = await api.get('/animais', {
        headers: {Authorization: `Bearer ${token}`}
      })
      setAnimais(animaisFromApi.data)
    }
  
    useEffect(() => {
  
      listaAnimais()
  
    }, [])

  return (
        <>
          <Swiper
            pagination={{
              clickable: true,
            }}
            navigation={true}
        
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {
        
                          animais.map((animal)=>(
                            <SwiperSlide>
                            <CardPet animais={animal}/>
                            </SwiperSlide>
                          ))
        
                      }
        
          </Swiper>
        </>
  );
}

export default Galeria
