import { IsUUID, IsInt, Min } from 'class-validator';

/**
 * DTO for booking request.
 * Validates the required fields: showtimeId, seatNumber, userId.
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
