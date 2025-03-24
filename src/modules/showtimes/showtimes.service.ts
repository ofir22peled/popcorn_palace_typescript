import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

/**
 * Service that handles all business logic related to showtimes.
 */
@Injectable()
export class ShowtimesService {
  private readonly logger = new Logger(ShowtimesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a single showtime by its ID.
   * Throws NotFoundException if the showtime does not exist.
   */
  async getShowtimeById(id: number) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
    });

    if (!showtime) {
      this.logger.warn(`Showtime with ID ${id} not found`);
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    this.logger.log(`Retrieving showtime with ID ${id}`);
    return showtime;
  }

  /**
   * Creates a new showtime, ensuring no overlap with existing showtimes.
   * Initializes 50 seats as available.
   * Logs the creation event.
   */
  async addShowtime(dto: CreateShowtimeDto) {
    const overlapping = await this.prisma.showtime.findFirst({
      where: {
        theater: dto.theater,
        OR: [
          {
            startTime: { lte: dto.startTime },
            endTime: { gt: dto.startTime },
          },
          {
            startTime: { lt: dto.endTime },
            endTime: { gte: dto.endTime },
          },
        ],
      },
    });

    if (overlapping) {
      this.logger.warn(`Overlap detected for theater "${dto.theater}"`);
      throw new ConflictException(
        'Showtime conflicts with another showtime in the same theater.',
      );
    }

    this.logger.log(`Creating new showtime for movieId ${dto.movieId}`);
    const created = await this.prisma.showtime.create({
      data: {
        ...dto,
        seatsAvailable: Array(50).fill(0), // Initialize 50 available seats
      },
    });

    // Respond only with the required fields as per the README
    return {
      id: created.id,
      price: created.price,
      movieId: created.movieId,
      theater: created.theater,
      startTime: created.startTime,
      endTime: created.endTime,
    };
  }

  /**
   * Updates an existing showtime by ID.
   * Logs the update event and throws NotFoundException if not found.
   */
  async updateShowtime(id: number, dto: UpdateShowtimeDto) {
    await this.getShowtimeById(id); // Ensure the showtime exists
    this.logger.log(`Updating showtime ID ${id}`);
    return this.prisma.showtime.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Deletes a showtime by ID.
   * Logs the deletion event and throws NotFoundException if not found.
   */
  async deleteShowtime(id: number) {
    await this.getShowtimeById(id); // Ensure the showtime exists
    this.logger.warn(`Deleting showtime ID ${id}`);
    return this.prisma.showtime.delete({
      where: { id },
    });
  }

  /**
   * Used internally by other services to fetch showtime details.
   */
  async findById(id: number) {
    return this.prisma.showtime.findUnique({
      where: { id },
    });
  }

  /**
   * Checks if a specific seat is available for a given showtime.
   */
  async isSeatAvailable(showtimeId: number, seatNumber: number): Promise<boolean> {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });

    if (!showtime || !Array.isArray(showtime.seatsAvailable)) return false;

    const index = seatNumber - 1;
    return showtime.seatsAvailable[index] === 0;
  }

  /**
   * Reserves a specific seat for a given showtime if it is available.
   * Logs the reservation event.
   */
  async reserveSeat(showtimeId: number, seatNumber: number): Promise<boolean> {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
      select: { seatsAvailable: true },
    });

    if (!showtime || !Array.isArray(showtime.seatsAvailable)) return false;

    const index = seatNumber - 1;
    if (showtime.seatsAvailable[index] === 1) return false;

    const updatedSeats = [...showtime.seatsAvailable];
    updatedSeats[index] = 1;

    await this.prisma.showtime.update({
      where: { id: showtimeId },
      data: { seatsAvailable: updatedSeats },
    });

    this.logger.log(`Seat ${seatNumber} reserved for showtime ${showtimeId}`);
    return true;
  }
}
