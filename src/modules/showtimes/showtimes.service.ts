import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Showtime } from './showtimes.interface';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

/**
 * Service that manages showtimes.
 * Handles business logic such as preventing overlapping showtimes
 * and managing seat availability for ticket booking.
 */
@Injectable()
export class ShowtimesService {
  private showtimes: Showtime[] = [];
  private nextId = 1;

  /**
   * Get all showtimes.
   */
  getShowtimes(): Showtime[] {
    return this.showtimes;
  }

  /**
   * Get a single showtime by ID.
   * Throws NotFoundException if not found.
   */
  getShowtimeById(id: number): Showtime {
    const showtime = this.showtimes.find((st) => st.id === id);
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return showtime;
  }

  /**
   * Add a new showtime.
   * Ensures no overlapping showtimes in the same theater.
   * Initializes the seats array to track seat availability.
   */
  addShowtime(showtimeDto: CreateShowtimeDto): Showtime {
    // Check for overlapping showtimes
    const conflict = this.showtimes.find(
      (st) =>
        st.theaterId === showtimeDto.theaterId &&
        ((showtimeDto.startTime >= st.startTime &&
          showtimeDto.startTime < st.endTime) ||
          (showtimeDto.endTime > st.startTime &&
            showtimeDto.endTime <= st.endTime))
    );

    if (conflict) {
      throw new ConflictException(
        'Showtime conflicts with an existing showtime in the same theater.',
      );
    }

    const newShowtime: Showtime = {
      id: this.nextId++,
      ...showtimeDto,
      seats: Array(50).fill(0), // initialize 50 available seats (0 = free, 1 = reserved)
    };

    this.showtimes.push(newShowtime);
    return newShowtime;
  }

  /**
   * Update an existing showtime.
   */
  updateShowtime(id: number, updatedShowtime: UpdateShowtimeDto): Showtime {
    const index = this.showtimes.findIndex((st) => st.id === id);
    if (index === -1) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    this.showtimes[index] = {
      ...this.showtimes[index],
      ...updatedShowtime,
    };
    return this.showtimes[index];
  }

  /**
   * Delete a showtime by ID.
   */
  deleteShowtime(id: number): Showtime {
    const index = this.showtimes.findIndex((st) => st.id === id);
    if (index === -1) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return this.showtimes.splice(index, 1)[0];
  }

  /**
   * Find a showtime by ID (for external use like booking service).
   * Returns undefined if not found.
   */
  async findById(id: number): Promise<Showtime | undefined> {
    return this.showtimes.find((s) => s.id === id);
  }

  /**
   * Checks if a specific seat is available for a given showtime.
   * @param showtimeId - Showtime ID
   * @param seatNumber - Seat number (1-based)
   */
  async isSeatAvailable(
    showtimeId: number,
    seatNumber: number,
  ): Promise<boolean> {
    const showtime = await this.findById(showtimeId);
    if (!showtime) return false;

    const index = seatNumber - 1;
    if (index < 0 || index >= showtime.seats.length) return false;

    return showtime.seats[index] === 0;
  }

  /**
   * Reserves a specific seat in the showtime if available.
   * Returns true if successful, false otherwise.
   */
  async reserveSeat(
    showtimeId: number,
    seatNumber: number,
  ): Promise<boolean> {
    const showtime = await this.findById(showtimeId);
    if (!showtime) return false;

    const index = seatNumber - 1;
    if (index < 0 || index >= showtime.seats.length) return false;

    if (showtime.seats[index] === 1) return false;

    showtime.seats[index] = 1;
    return true;
  }
}
