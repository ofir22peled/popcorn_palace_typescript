import { IsString, IsInt, Min, IsNumber, Max } from 'class-validator';

/**
 * DTO to validate the input for creating a new movie.
 */
export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Min(1900)
  releaseYear: number; // Validation for current year done dynamically in service
}
