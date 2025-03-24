import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Handles POST /movies - Add a new movie.
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createMovie(@Body() movie: CreateMovieDto) {
    return this.moviesService.addMovie(movie);
  }

  /**
   * Handles GET /movies/all - Return all movies.
   */
  @Get('all')
  getAllMovies() {
    return this.moviesService.getMovies();
  }

  /**
   * Handles POST /movies/update/:movieTitle - Update a movie by title.
   */
  @Post('update/:movieTitle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: UpdateMovieDto
  ) {
    return this.moviesService.updateMovie(movieTitle, updatedMovie);
  }

  /**
   * Handles DELETE /movies/:movieTitle - Delete a movie by title.
   */
  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.deleteMovie(movieTitle);
  }
}
