import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { config } from '../../../config';

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
 * Retrieves all showtimes.
 */
async getAllShowtimes() {
  this.logger.log('Retrieving all showtimes');
  return this.prisma.showtime.findMany();
}

/**
 * Creates a new showtime, ensuring no overlap with existing showtimes.
 * Logs the creation event.
 * Returns only required fields.
 */
async addShowtime(dto: CreateShowtimeDto) {
  // Check that the movie exists
  const movie = await this.prisma.movie.findUnique({
    where: { id: dto.movieId },
  });

  if (!movie) {
    this.logger.warn(`Movie with ID ${dto.movieId} not found`);
    throw new NotFoundException(`Movie with ID ${dto.movieId} not found`);
  }

  // Check for overlapping showtimes
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
      seatsAvailable: Array(config.seatsPerShowtime).fill(0),
    },
  });

  const { seatsAvailable, ...rest } = created;
  return rest;
}


  /**
   * Updates an existing showtime by ID.
   * Logs the update event and throws NotFoundException if not found.
   */
  async updateShowtime(id: number, dto: UpdateShowtimeDto) {
    await this.getShowtimeById(id); // Ensure the showtime exists
    this.logger.log(`Updating showtime ID ${id}`);

  //check if new movieId exists (if provided)
  if (dto.movieId) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });

    if (!movie) {
      this.logger.warn(`Movie with ID ${dto.movieId} not found`);
      throw new NotFoundException(`Movie with ID ${dto.movieId} not found`);
    }
  }

  
    // Exclude seatsAvailable before updating (it shouldn't be updated)
    const { seatsAvailable, ...rest } = dto;
  

    const updated = await this.prisma.showtime.update({
      where: { id },
      data: rest,
    });
  
    this.logger.log(`Showtime ID ${id} updated successfully`);
    return updated;
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
