import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './movies.interface';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [
        { id: 1, title: 'Inception', genre: 'Action', duration: 148, rating: 8.8, releaseYear: 2010 },
        { id: 2, title: 'Interstellar', genre: 'Sci-Fi', duration: 169, rating: 8.6, releaseYear: 2014 },
        { id: 3, title: 'The Dark Knight', genre: 'Action', duration: 152, rating: 9.0, releaseYear: 2008 },
      ];
      private nextId = 4;

    getMovies() {
        return this.movies;
    }

    addMovie(movie: { title: string; genre: string; duration: number; rating: number; releaseYear: number }) {
        const newMovie: Movie = { id: this.nextId++, ...movie };
        this.movies.push(newMovie);
        return newMovie;
      }

    updateMovie(movieTitle: string, updatedMovie: { title: string; genre: string; duration: number; rating: number; releaseYear: number }) {
        const index = this.movies.findIndex(movie => movie.title === movieTitle);
        if (index === -1) {
          throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
        }
        
        this.movies[index] = { ...this.movies[index], ...updatedMovie };
        return this.movies[index];
      }
      

      deleteMovie(movieTitle: string) {
        const index = this.movies.findIndex(movie => movie.title === movieTitle);
        if (index === -1) {
          throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
        }
        return this.movies.splice(index, 1)[0];
      }
}