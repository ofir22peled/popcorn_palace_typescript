import { IsInt, IsDateString, IsPositive, IsString } from 'class-validator';

/**
 * DTO for creating a new showtime.
 * Ensures that only valid data is accepted when creating a showtime.
 */
export class CreateShowtimeDto {
  @IsInt()
  movieId: number;

  @IsString()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsPositive()
  price: number;
}
