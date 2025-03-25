import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsPositive, IsString, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEndDateAfterStartDate } from '../../../validators/date-validator';

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
  @Type(() => Date)
  @IsDate()
  startTime: Date; // Converted to Date object automatically by class-transformer.

  @ApiProperty({ example: '2025-04-01T20:30:00Z' })
  @Type(() => Date)
  @IsDate()
  @Validate(IsEndDateAfterStartDate, ['startTime'], {
    message: 'End time must be after start time',
  })
  endTime: Date; // Ensures endTime is after startTime.

  @ApiProperty({ example: 45.5 })
  @Type(() => Number)
  @IsPositive()
  price: number; // Explicitly transformed into number type.
}

