import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() bookingDto: CreateBookingDto) {
    const result = await this.bookingsService.createBooking(bookingDto);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}