import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movies.interface';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  getAllMovies(): Movie[] {
    return this.moviesService.getMovies();
  }

  @Post()
  createMovie(@Body() movie: Omit<Movie, 'id'>): Movie {
    return this.moviesService.addMovie(movie);
  }

  @Post('update/:movieTitle')
  updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: Omit<Movie, 'id'>
  ): Movie {
    return this.moviesService.updateMovie(movieTitle, updatedMovie);
  }

  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') movieTitle: string): Movie {
    return this.moviesService.deleteMovie(movieTitle);
  }
}
