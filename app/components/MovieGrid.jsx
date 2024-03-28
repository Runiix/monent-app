'use client'

import MovieScrollerImage from "./MovieScrollerImage";
import { useState, useEffect} from "react"
import { supabase } from "../utils/supabaseClient";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

export default function MovieGrid({favorites= false, genre= null, searchQuery}){

    const [movieList, setMovieList]= useState(null)
    const [sortedBy, setSortedBy]= useState('vote_average')
    const [sortOrder, setSortOrder]= useState(false)
    const [genreList, setGenreList]= useState(genre)
    const [user, setUser]= useState()

    console.log(searchQuery)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: user, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
            } else {
                console.log(user)
                setUser(user)
            }
        };
            fetchUser();
        }, []);


    const getMovieFromDB = async () =>{
        try{
            if(favorites === false){
                const {data, error} = await supabase.from('Movies').select('*').contains('genre_ids', [genreList]).order(sortedBy, {ascending: sortOrder})
                if(error) return error;
                else{
                    setMovieList(data)
                    console.log(data)
                } 
            }else{
                const {data, error} = await supabase.from('Favorites').select('*').eq('user_id', user.id)
                if(error) return error;
                else{
                    setMovieList(data)
                    console.log(data)
                } 
            }

        }catch(error){
            console.log('Error getting data from DB:', error)
        }
    }

    useEffect(()=>{
        getMovieFromDB();
        console.log(movieList)
    }, [sortedBy, genreList, sortOrder])

   

    const movieScrollerImages = movieList !== null && movieList
        .filter(movie => movie.title.toLowerCase().includes(searchQuery))
        .map((movie, index) => (
            <MovieScrollerImage 
                key={index} 
                id={movie.id}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                src2={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                title={movie.title} 
                overview={movie.overview}
                rating={movie.vote_average.toFixed(1)}
                votecount={movie.vote_count}
                releasedate={movie.release_date}
                genre={movie.genre_ids}
            />
    ));
    const changeSort= (sort)=>{
        setSortedBy(sort)
    }
    const changeGenre= (genre) =>{
        if(genre=== "1"){
            setGenreList(null)
        }else{
        setGenreList(genre)
        }
    }

    return(
        <div className="w-screen flex flex-col items-center">
            <div className="absolute top-24 md-top-32 flex flex-col md:flex-row gap-5 md:gap-0 justify-between w-[80vw] m-5 items-center">
                <div>
                    <select name="select-genre" id="select-genre" placeholder="All Movies" className="bg-zinc-900 border border-slate-100 hover:bg-zinc-800 hover:cursor-pointer p-2" onChange={(e) => changeGenre(e.target.value)}>
                        <option value="1">All Movies</option>
                        <option value="28">Action</option>
                        <option value="12">Adventure</option>
                        <option value="16">Animation</option>
                        <option value="35">Comedy</option>
                        <option value="80">Crime</option>
                        <option value="99">Documentary</option>
                        <option value="18">Drama</option>
                        <option value="10751">Family</option>
                        <option value="14">Fantasy</option>
                        <option value="36">History</option>
                        <option value="27">Horror</option>
                        <option value="10402">Music</option>
                        <option value="9648">Mystery</option>
                        <option value="10749">Romance</option>
                        <option value="878">Science Fiction</option>
                        <option value="10770">TV Movie</option>
                        <option value="53">Thriller</option>
                        <option value="10752">War</option>
                        <option value="37">Western</option>
                    </select>
                </div>
                <div>
                </div>
                <div>
                    <select name="sorted-by" id="sorted-by" placeholder="Sort By" className="bg-zinc-900 border border-slate-100 hover:bg-zinc-800 hover:cursor-pointer p-2" onChange={(e) => changeSort(e.target.value)}>  
                            <option value="vote_average">Rating</option>
                            <option value="title">Alphabetical</option>
                            <option value="popularity">Popularity</option>
                         
                    </select> 
                    {
                        !sortOrder ? <ArrowDownward onClick={() =>setSortOrder(true)} className="hover:cursor-pointer"/> : <ArrowUpward onClick={() =>setSortOrder(false)} className="hover:cursor-pointer"/>
                    }
                </div>
            </div>
            <div className="w-full ml-[20vw] sm:mlS-[14vw] md:ml-[14vw] lg:ml-[10vw] 2xl:ml-[5vw]">
                {
                    movieList !== null &&
                        <div className="mx-5 flex flex-wrap absolute top-[20vh] overflow-x-hidden gap-x-5">
                            {movieScrollerImages}
                        </div>     
                }
            </div>
        </div>
    )
}