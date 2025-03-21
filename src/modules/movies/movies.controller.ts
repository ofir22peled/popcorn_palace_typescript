import { Controller, Get, Post, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  getAllMovies() {
    return this.moviesService.getMovies();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createMovie(@Body() movie: CreateMovieDto) {
    return this.moviesService.addMovie(movie);
  }

  @Post('update/:movieTitle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: UpdateMovieDto
  ) {
    return this.moviesService.updateMovie(movieTitle, updatedMovie);
  }

  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.deleteMovie(movieTitle);
  }
}
