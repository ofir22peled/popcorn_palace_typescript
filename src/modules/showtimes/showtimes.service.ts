/**
 * Service that manages showtimes.
 * Handles business logic such as preventing overlapping showtimes.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Showtime } from './showtimes.interface';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

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
   */
  getShowtimeById(id: number): Showtime {
    const showtime = this.showtimes.find(st => st.id === id);
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return showtime;
  }

  /**
   * Add a new showtime.
   * Ensures no overlapping showtimes in the same theater.
   */
  addShowtime(showtimeDto: CreateShowtimeDto): Showtime {
    // Check for overlapping showtimes
    const conflict = this.showtimes.find(st =>
      st.theaterId === showtimeDto.theaterId &&
      ((showtimeDto.startTime >= st.startTime && showtimeDto.startTime < st.endTime) ||
       (showtimeDto.endTime > st.startTime && showtimeDto.endTime <= st.endTime))
    );

    if (conflict) {
      throw new Error('Showtime conflicts with an existing showtime in the same theater.');
    }

    const newShowtime: Showtime = { id: this.nextId++, ...showtimeDto };
    this.showtimes.push(newShowtime);
    return newShowtime;
  }

  /**
   * Update an existing showtime.
   */
  updateShowtime(id: number, updatedShowtime: UpdateShowtimeDto): Showtime {
    const index = this.showtimes.findIndex(st => st.id === id);
    if (index === -1) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    this.showtimes[index] = { ...this.showtimes[index], ...updatedShowtime };
    return this.showtimes[index];
  }

  /**
   * Delete a showtime by ID.
   */
  deleteShowtime(id: number): Showtime {
    const index = this.showtimes.findIndex(st => st.id === id);
    if (index === -1) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }
    return this.showtimes.splice(index, 1)[0];
  }
}
