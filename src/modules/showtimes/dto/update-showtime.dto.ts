import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDto } from './create-showtime.dto';

/**
 * Inherits all validations from CreateShowtimeDto,
 * but makes every field optional for flexible partial updates.
 */
export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
