import { PartialType } from '@nestjs/swagger';
import { CreateShowtimeDto } from './create-showtime.dto';

/**
 * DTO for updating an existing showtime.
 * All fields are optional for partial updates,
 * but excludes `seatsAvailable` from updates.
 */
export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {
  // Optionally exclude seatsAvailable from the update
  seatsAvailable?: never; // Prevents seatsAvailable from being updated
}
