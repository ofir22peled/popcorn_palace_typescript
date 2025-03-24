import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Movie } from './movies.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

/**
 * Service that handles business logic for managing movies.
 * Uses Prisma to persist data in the PostgreSQL database.
 */
@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all movies stored in the database.
   */
  async getMovies(): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }

  /**
   * Adds a new movie after checking for title uniqueness.
   * @throws ConflictException if movie with the same title exists.
   */
  async addMovie(movie: CreateMovieDto): Promise<Movie> {
    const existing = await this.prisma.movie.findUnique({
      where: { title: movie.title },
    });

    if (existing) {
      throw new ConflictException(`Movie with title "${movie.title}" already exists`);
    }

    return this.prisma.movie.create({
      data: movie,
    });
  }

  /**
   * Updates a movie by its title, only if it exists.
   * @throws NotFoundException if the movie is not found.
   */
  async updateMovie(
    movieTitle: string,
    updatedMovie: UpdateMovieDto,
  ): Promise<Movie> {
    const existing = await this.prisma.movie.findUnique({
      where: { title: movieTitle },
    });

    if (!existing) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    return this.prisma.movie.update({
      where: { title: movieTitle },
      data: updatedMovie,
    });
  }

  /**
   * Deletes a movie by its title.
   * @throws NotFoundException if the movie is not found.
   */
  async deleteMovie(movieTitle: string): Promise<Movie> {
    const existing = await this.prisma.movie.findUnique({
      where: { title: movieTitle },
    });

    if (!existing) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    return this.prisma.movie.delete({
      where: { title: movieTitle },
    });
  }
}
