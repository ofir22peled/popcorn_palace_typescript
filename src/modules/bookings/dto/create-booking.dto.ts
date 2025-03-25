import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

/**
 * DTO for creating a booking.
 * Validates request body for booking creation.
 */
export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  showtimeId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  seatNumber: number;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  userId: string;
}