import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Movie } from './movies.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

/**
 * MoviesService contains business logic for handling movies.
 */
@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches all movies from the database.
   */
  async getMovies(): Promise<Movie[]> {
    this.logger.log('Retrieving all movies from database');
    return this.prisma.movie.findMany();
  }

  /**
   * Adds a new movie, checks for uniqueness and validates year dynamically.
   */
  async addMovie(movie: CreateMovieDto): Promise<Movie> {
    this.logger.log(`Attempting to add movie: ${movie.title}`);

    const existing = await this.prisma.movie.findUnique({
      where: { title: movie.title },
    });

    if (existing) {
      this.logger.warn(`Movie "${movie.title}" already exists`);
      throw new ConflictException(`Movie "${movie.title}" already exists`);
    }

    const currentYear = new Date().getFullYear();
    if (movie.releaseYear > currentYear) {
      this.logger.warn(`Invalid release year: ${movie.releaseYear}`);
      throw new BadRequestException(`Release year cannot be greater than ${currentYear}`);
    }

    const createdMovie = await this.prisma.movie.create({
      data: movie,
    });

    this.logger.log(`Movie "${movie.title}" added successfully`);
    return createdMovie;
  }

  /**
 * Updates an existing movie, validates existence and release year dynamically.
 * Also checks if the new title already exists when the title is changed.
 */
async updateMovie(movieTitle: string, updatedMovie: UpdateMovieDto): Promise<Movie> {
  this.logger.log(`Attempting to update movie: ${movieTitle}`);

  const existing = await this.prisma.movie.findUnique({
    where: { title: movieTitle },
  });

  if (!existing) {
    this.logger.warn(`Movie "${movieTitle}" not found`);
    throw new NotFoundException(`Movie "${movieTitle}" not found`);
  }

  // Check if the updated title is different and if it already exists
  if (updatedMovie.title && updatedMovie.title !== movieTitle) {
    const movieWithNewTitle = await this.prisma.movie.findUnique({
      where: { title: updatedMovie.title },
    });

    if (movieWithNewTitle) {
      this.logger.warn(`Cannot update movie: New title "${updatedMovie.title}" already exists`);
      throw new ConflictException(`Movie with title "${updatedMovie.title}" already exists`);
    }
  }
  
  if (updatedMovie.releaseYear) {
    const currentYear = new Date().getFullYear();
    if (updatedMovie.releaseYear > currentYear) {
      this.logger.warn(`Invalid release year: ${updatedMovie.releaseYear}`);
      throw new BadRequestException(`Release year cannot be greater than ${currentYear}`);
    }
  }

  const updated = await this.prisma.movie.update({
    where: { title: movieTitle },
    data: updatedMovie,
  });

  this.logger.log(`Movie "${movieTitle}" updated successfully`);
  return updated;
}


/**
 * Deletes a movie by its title after verifying existence.
 */
async deleteMovie(movieTitle: string): Promise<Movie> {
  this.logger.log(`Attempting to delete movie: ${movieTitle}`);

  // Verify movie exists
  const existing = await this.prisma.movie.findUnique({
    where: { title: movieTitle },
  });

  if (!existing) {
    this.logger.warn(`Movie "${movieTitle}" not found`);
    throw new NotFoundException(`Movie "${movieTitle}" not found`);
  }

  // Delete the movie
  const deletedMovie = await this.prisma.movie.delete({
    where: { title: movieTitle },
  });

  this.logger.log(`Movie "${movieTitle}" deleted successfully`);
  return deletedMovie;
  }
}