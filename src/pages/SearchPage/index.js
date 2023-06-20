import axios from '../../api/axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./SearchPage.css"
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchPage() {
  // console.log(useLocation())
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState([])

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()

  // const searchTerm = query.get('q')
  const debouncedSearchTerm = useDebounce(query.get("q"), 500)

  useEffect(()=>{
    if(debouncedSearchTerm){
      fetchSearchMovie(debouncedSearchTerm)
    }
  },[debouncedSearchTerm])

  const fetchSearchMovie = async(searchTerm) => {
    try{
      const request = await axios.get(
        `/search/multi?include_adult=false&query=${searchTerm}`
      )

      console.log(request);
      setSearchResults(request.data.results)
    }catch (error){
      console.log("error", error)
    }
  }

  const renderSearchResults = () => {
    return searchResults.length > 0 ? (
      <section className='search-container'>
        {searchResults.map( (movie) => {
          if(movie.backdrop_path !== null && movie.media_type !== "person"){
            const movieImageUrl = 
            "https://image.tmdb.org/t/p/w500" + movie.backdrop_path

            return(
              <div className='movie' key={movie.id}>
                <div onClick={()=>navigate(`/${movie.id}`)} className='movie_column-poster'>
                  <img
                    src={movieImageUrl} alt="movie image"
                    className='movie_poster'
                  />
                </div>
              </div>
            )
          }
        })}
      </section>
      )
      :
      (
      <section className='no-results'>
        <div className='no-results_text'>
          <p>
            찾고자 하는 검색어 "{debouncedSearchTerm}"에 맞는 영화가 없습니다.
          </p>
          <p>Suggestions:</p>
          <ul>
            <li>Try different keywords</li>
          </ul>
        </div>
      </section>
      )
  }

  return renderSearchResults()
}
