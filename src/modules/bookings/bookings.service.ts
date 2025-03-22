import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { Booking } from './entities/booking.entity';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service responsible for creating bookings and managing seat reservations.
 */
@Injectable()
export class BookingsService {
  private bookings: Booking[] = []; // temporary in-memory storage

  constructor(
    private readonly showtimesService: ShowtimesService
  ) {}

  /**
   * Creates a booking if the showtime and seat are available.
   * @param dto - booking request containing showtimeId, seatNumber, and userId
   * @returns an object with bookingId if successful, or an error message
   */
  async createBooking(dto: CreateBookingDto): Promise<{ bookingId?: string; success: boolean; message: string }> {
    const showtime = await this.showtimesService.findById(dto.showtimeId);
    if (!showtime) {
      return { success: false, message: 'Showtime not found' };
    }

    const isAvailable = await this.showtimesService.isSeatAvailable(dto.showtimeId, dto.seatNumber);
    if (!isAvailable) {
      return { success: false, message: 'Seat not available' };
    }

    const success = await this.showtimesService.reserveSeat(dto.showtimeId, dto.seatNumber);
    if (!success) {
      return { success: false, message: 'Failed to reserve seat' };
    }

    const booking: Booking = {
      id: uuidv4(),
      userId: dto.userId,
      showtimeId: dto.showtimeId,
      seatNumber: dto.seatNumber,
      createdAt: new Date(),
    };

    this.bookings.push(booking);

    return { success: true, message: 'Booking successful', bookingId: booking.id };
  }
}
