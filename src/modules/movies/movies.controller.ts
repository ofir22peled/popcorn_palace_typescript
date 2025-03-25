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
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

/**
 * Controller to manage movie-related endpoints.
 */
@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  /**
   * GET /movies/all
   * Retrieves all movies.
   */
  @Get('all')
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all movies' })
  getAllMovies() {
    this.logger.log('Fetching all movies');
    return this.moviesService.getMovies();
  }

  /**
   * POST /movies
   * Adds a new movie to the database.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Movie created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Movie already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid release year' })
  @ApiBody({ type: CreateMovieDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createMovie(@Body() movie: CreateMovieDto) {
    this.logger.log(`Creating new movie: ${movie.title}`);
    return this.moviesService.addMovie(movie);
  }

  /**
   * POST /movies/update/:movieTitle
   * Updates movie details.
   */
  @Post('update/:movieTitle')
  @ApiOperation({ summary: 'Update movie details by title' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movie updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid release year' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Movie already exists' })
  @ApiParam({ name: 'movieTitle', description: 'Title of the movie to update' })
  @ApiBody({ type: UpdateMovieDto })
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
  @ApiOperation({ summary: 'Delete movie by title' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movie deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
  @ApiParam({ name: 'movieTitle', description: 'Title of the movie to delete' })
  deleteMovie(@Param('movieTitle') movieTitle: string) {
    this.logger.log(`Deleting movie: ${movieTitle}`);
    return this.moviesService.deleteMovie(movieTitle);
  }
}
