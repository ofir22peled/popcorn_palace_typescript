import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Business logic for managing bookings.
 */
@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Creates a booking after validating seat availability and showtime existence.
   * Returns bookingId if successful, else throws appropriate HTTP exceptions.
   */
  async createBooking(dto: CreateBookingDto): Promise<{ bookingId: string }> {
    this.logger.log(`Attempting booking: ShowtimeId=${dto.showtimeId}, Seat=${dto.seatNumber}, User=${dto.userId}`);

    // Verify showtime exists
    const showtime = await this.showtimesService.findById(dto.showtimeId);
    if (!showtime) {
      this.logger.warn(`Showtime not found: ID=${dto.showtimeId}`);
      throw new NotFoundException('Showtime not found');
    }

    // Verify seat availability
    const isAvailable = await this.showtimesService.isSeatAvailable(dto.showtimeId, dto.seatNumber);
    if (!isAvailable) {
      this.logger.warn(`Seat unavailable: ShowtimeId=${dto.showtimeId}, Seat=${dto.seatNumber}`);
      throw new BadRequestException('Seat not available');
    }

    // Reserve seat
    const reserved = await this.showtimesService.reserveSeat(dto.showtimeId, dto.seatNumber);
    if (!reserved) {
      this.logger.error(`Seat reservation failed: ShowtimeId=${dto.showtimeId}, Seat=${dto.seatNumber}`);
      throw new InternalServerErrorException('Failed to reserve seat');
    }

    // Create booking in DB
    const booking = await this.prisma.booking.create({
      data: {
        id: uuidv4(),
        userId: dto.userId,
        showtimeId: dto.showtimeId,
        seatNumber: dto.seatNumber,
      },
    });

    this.logger.log(`Booking created successfully. BookingId=${booking.id}`);

    // Return as per README specification
    return { bookingId: booking.id };
  }
}
