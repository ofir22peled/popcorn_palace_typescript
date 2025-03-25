import { Body, Controller, Post, UsePipes,ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

/**
 * Handles HTTP requests related to bookings.
 */
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /bookings
   * Creates a booking and returns its ID.
   */
  @Post()
  @ApiOperation({ summary: 'Create a booking and returns bookingId' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Booking created successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Showtime not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Seat not available' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to reserve seat' })
  @ApiBody({ type: CreateBookingDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }
}
