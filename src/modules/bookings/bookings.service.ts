import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(BookingsService.name);  // Logger for tracking actions

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
      this.logger.warn(`Showtime with ID ${dto.showtimeId} not found.`);
      return { success: false, message: 'Showtime not found' };
    }

    // Check if the requested seat is available
    const isAvailable = await this.showtimesService.isSeatAvailable(dto.showtimeId, dto.seatNumber);
    if (!isAvailable) {
      this.logger.warn(`Seat ${dto.seatNumber} is not available for showtime ${dto.showtimeId}.`);
      return { success: false, message: 'Seat not available' };
    }

    // Attempt to reserve the seat
    const reserved = await this.showtimesService.reserveSeat(dto.showtimeId, dto.seatNumber);
    if (!reserved) {
      this.logger.error(`Failed to reserve seat ${dto.seatNumber} for showtime ${dto.showtimeId}.`);
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

    this.logger.log(`Booking created for userId: ${dto.userId}, showtimeId: ${dto.showtimeId}, seatNumber: ${dto.seatNumber}`);
    return {
      success: true,
      message: 'Booking successful',
      bookingId: booking.id,
    };
  }
}
