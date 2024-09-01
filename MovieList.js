// src/components/MovieList.js
import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../services/api'; // Function to fetch movies based on search
import axios from 'axios'; // Import axios if not already done
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [backgroundPoster, setBackgroundPoster] = useState('');

  // Fetch popular movies to get a poster for the background
  useEffect(() => {
    const fetchBackgroundMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular`,
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // Make sure your API key is properly set up in .env
            },
          }
        );

        // Get a random movie from the popular list
        const randomMovie =
          response.data.results[
            Math.floor(Math.random() * response.data.results.length)
          ];

        // Set the background poster path
        setBackgroundPoster(
          `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`
        );
      } catch (error) {
        console.error('Error fetching background movie:', error);
      }
    };

    fetchBackgroundMovie();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const results = await fetchMovies(searchTerm);
      setMovies(results);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="movie-list-background"
      style={{
        backgroundImage: `url(${backgroundPoster})`, // Dynamically set the background image
      }}
    >
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
