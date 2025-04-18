import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

/**
 * DTO for updating a movie.
 * Allows partial updates.
 */
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
