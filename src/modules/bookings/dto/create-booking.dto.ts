import { IsInt, IsUUID, Min } from 'class-validator';

/**
 * DTO for creating a booking.
 * Validates request body for booking creation.
 */
export class CreateBookingDto {
  @IsInt()
  @Min(1)
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsUUID()
  userId: string;
}
