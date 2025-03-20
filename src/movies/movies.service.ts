import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesService {
    private movies = [
        { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010 },
        { id: 2, title: 'Interstellar', genre: 'Sci-Fi', year: 2014 },
        { id: 3, title: 'The Dark Knight', genre: 'Action', year: 2008 },
      ];

    getMovies() {
        return this.movies;
    }
}
