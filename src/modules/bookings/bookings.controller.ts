import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

/**
 * Handles HTTP requests related to bookings.
 */
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /bookings
   * Creates a booking and returns its ID.
   */
  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }
}
