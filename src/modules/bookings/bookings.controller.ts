import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

/**
 * Controller for handling booking-related HTTP requests.
 * Handles creation, updates, and deletion of bookings.
 */
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /bookings
   * Creates a new booking if the seat is available.
   * Calls the BookingsService to handle the logic and return success or failure.
   */
  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }
}
