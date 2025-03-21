/**
 * DTO for creating a new showtime.
 * Ensures that only valid data is accepted.
 */
import { IsInt, IsDateString, IsPositive } from 'class-validator';

export class CreateShowtimeDto {
  @IsInt()
  movieId: number;

  @IsInt()
  theaterId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsPositive()
  price: number;
}
