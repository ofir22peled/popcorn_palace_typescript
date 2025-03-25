import { IsInt, IsUUID, Min } from 'class-validator';

/**
 * DTO for creating a booking.
 * Ensures that only valid data is accepted when creating a booking.
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
