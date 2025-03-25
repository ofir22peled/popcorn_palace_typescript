import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

/**
 * Controller to manage movie-related endpoints.
 */
@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  /**
   * POST /movies
   * Adds a new movie to the database.
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createMovie(@Body() movie: CreateMovieDto) {
    this.logger.log(`Creating new movie: ${movie.title}`);
    return this.moviesService.addMovie(movie);
  }

  /**
   * GET /movies/all
   * Retrieves all movies.
   */
  @Get('all')
  getAllMovies() {
    this.logger.log('Fetching all movies');
    return this.moviesService.getMovies();
  }

  /**
   * POST /movies/update/:movieTitle
   * Updates movie details.
   */
  @Post('update/:movieTitle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: UpdateMovieDto,
  ) {
    this.logger.log(`Updating movie: ${movieTitle}`);
    return this.moviesService.updateMovie(movieTitle, updatedMovie);
  }

  /**
   * DELETE /movies/:movieTitle
   * Deletes a movie.
   */
  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') movieTitle: string) {
    this.logger.log(`Deleting movie: ${movieTitle}`);
    return this.moviesService.deleteMovie(movieTitle);
  }
}
