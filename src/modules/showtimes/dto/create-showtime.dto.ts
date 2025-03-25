import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsPositive, IsString } from 'class-validator';

/**
 * DTO for creating a new showtime.
 * Ensures that only valid data is accepted when creating a showtime.
 */
export class CreateShowtimeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  movieId: number;

  @ApiProperty({ example: 'Cinema City Theater 5' })
  @IsString()
  theater: string;

  @ApiProperty({ example: '2025-04-01T18:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-04-01T20:30:00Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 45.5 })
  @IsPositive()
  price: number;
}
