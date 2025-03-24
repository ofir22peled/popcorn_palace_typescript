import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service responsible for managing seat bookings.
 * Handles seat availability, reservation, and booking persistence.
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Attempts to create a new booking.
   * Validates showtime existence and seat availability,
   * then creates the booking in the database.
   */
  async createBooking(dto: CreateBookingDto): Promise<{ bookingId?: string; success: boolean; message: string }> {
    // Validate showtime existence
    const showtime = await this.showtimesService.findById(dto.showtimeId);
    if (!showtime) {
      return { success: false, message: 'Showtime not found' };
    }

    // Check if the requested seat is available
    const isAvailable = await this.showtimesService.isSeatAvailable(dto.showtimeId, dto.seatNumber);
    if (!isAvailable) {
      return { success: false, message: 'Seat not available' };
    }

    // Attempt to reserve the seat
    const reserved = await this.showtimesService.reserveSeat(dto.showtimeId, dto.seatNumber);
    if (!reserved) {
      return { success: false, message: 'Failed to reserve seat' };
    }

    // Create booking in the database
    const booking = await this.prisma.booking.create({
      data: {
        id: uuidv4(),
        userId: dto.userId,
        showtimeId: dto.showtimeId,
        seatNumber: dto.seatNumber,
      },
    });

    return {
      success: true,
      message: 'Booking successful',
      bookingId: booking.id,
    };
  }
}
