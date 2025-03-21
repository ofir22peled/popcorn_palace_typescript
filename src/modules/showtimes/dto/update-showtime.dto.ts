/**
 * DTO for updating an existing showtime.
 * All fields are optional to allow partial updates.
 */
import { IsInt, IsDateString, IsPositive, IsOptional } from 'class-validator';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsInt()
  movieId?: number;

  @IsOptional()
  @IsInt()
  theaterId?: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsPositive()
  price?: number;
}
