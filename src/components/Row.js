import React, { useEffect, useState } from 'react'
import axios from "../api/axios"
import "./Row.css"
import MovieModal from './MovieModal'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import {Swiper, SwiperSlide} from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
export default function Row({isLargeRow, title, id, fetchUrl}) {

  const [movies, setMovies] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [movieSelected, setMovieSelected] = useState({})

  useEffect( ()=>{
    fetchMovieData()
  },[])

  const fetchMovieData = async() => {
    const request = await axios.get(fetchUrl)
    // console.log(request)
    setMovies(request.data.results)
  }

  const handleClick = (movie) => {
    setModalOpen(true)
    setMovieSelected(movie)
  }

  return (
    <section className='row'>
      <h2>{title}</h2>
      {/* <div className='slider'>

        <div className='slider_arrow-left'>
          <span className='arrow' 
            onClick={()=>{
            document.getElementById(id).scrollLeft -= window.innerWidth - 80
            }}>{"<"}</span>
        </div> */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          loop={true}
          breakpoints={{
            1378: {
              slidesPerView: 6, // 한번에 보이는 슬라이드 개수
              slidesPerGroup: 6, // 몇개씩 슬라이드 할지
            },
            998: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            625: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            0: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          pagination={{clickable: true}}
          navigation
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
          <div id={id} className='row_posters'>
            {movies.map( movie => (
              <SwiperSlide>
                <img 
                  key={movie.id}
                  style={{padding:"25px 0"}}
                  className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                  src={`https://image.tmdb.org/t/p/original/${
                      isLargeRow ? movie.poster_path : movie.backdrop_path
                    } `}
                  alt={movie.name}
                  onClick={()=>handleClick(movie)}
                />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
        {/* <div className='slider_arrow-right'>
          <span className='arrow'
            onClick={()=>{
            document.getElementById(id).scrollLeft += window.innerWidth - 80
          }}>{">"}</span>
        </div>

      </div> */}

      {
        modalOpen && 
        <MovieModal {...movieSelected} setModalOpen={setModalOpen} />
      }
    </section>
  )
}
