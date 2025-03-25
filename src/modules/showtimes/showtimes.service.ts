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
 * Service handling all showtime-related operations.
 */
@Injectable()
export class ShowtimesService {
  private readonly logger = new Logger(ShowtimesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a showtime by its ID.
   */
  async getShowtimeById(id: number) {
    const showtime = await this.prisma.showtime.findUnique({ where: { id } });
    if (!showtime) {
      this.logger.warn(`Showtime with ID ${id} not found.`);
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    this.logger.log(`Retrieved showtime with ID ${id}.`);
    
    return showtime;
  }

  /**
   * Retrieves all showtimes.
   */
  async getAllShowtimes() {
    this.logger.log('Retrieving all showtimes.');
    return this.prisma.showtime.findMany();
  }

  /**
   * Adds a new showtime, ensuring no overlapping showtimes exist.
   */
  async addShowtime(dto: CreateShowtimeDto) {
    const movieExists = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });

    if (!movieExists) {
      this.logger.warn(`Movie with ID ${dto.movieId} not found.`);
      throw new NotFoundException(`Movie with ID ${dto.movieId} not found.`);
    }

    // Validate overlapping showtimes
    await this.validateNoOverlap(dto.theater, dto.startTime, dto.endTime);

    const created = await this.prisma.showtime.create({
      data: {
        movieId: dto.movieId,
        theater: dto.theater,
        startTime: dto.startTime,
        endTime: dto.endTime,
        price: dto.price,
        seatsAvailable: Array(config.seatsPerShowtime).fill(0),
      },
    });

    this.logger.log(`Created showtime ID ${created.id} for movie ID ${dto.movieId}.`);

    return created;
  }

  /**
   * Updates an existing showtime.
   */
  async updateShowtime(id: number, dto: UpdateShowtimeDto) {
    await this.getShowtimeById(id); // Ensure showtime exists

    if (dto.movieId) {
      const movieExists = await this.prisma.movie.findUnique({
        where: { id: dto.movieId },
      });
      if (!movieExists) {
        this.logger.warn(`Movie with ID ${dto.movieId} not found.`);
        throw new NotFoundException(`Movie with ID ${dto.movieId} not found.`);
      }
    }

    // Fetch existing showtime for comparison
    const existingShowtime = await this.prisma.showtime.findUnique({ where: { id } });

    // Use existing values if not provided in dto
    const updatedStartTime = dto.startTime || existingShowtime.startTime;
    const updatedEndTime = dto.endTime || existingShowtime.endTime;
    const updatedTheater = dto.theater || existingShowtime.theater;

    // Validate overlapping showtimes
    await this.validateNoOverlap(updatedTheater, updatedStartTime, updatedEndTime, id);

    const { seatsAvailable, ...updateData } = dto;

    const updated = await this.prisma.showtime.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Showtime ID ${id} updated successfully.`);
    return updated;
  }

  /**
   * Deletes a showtime by ID.
   */
  async deleteShowtime(id: number) {
    await this.getShowtimeById(id); // Ensure existence
    this.logger.warn(`Deleting showtime ID ${id}.`);
    return this.prisma.showtime.delete({ where: { id } });
  }

  /**
   * Checks if a specific seat is available.
   */
  async isSeatAvailable(showtimeId: number, seatNumber: number): Promise<boolean> {
    const showtime = await this.prisma.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime?.seatsAvailable) return false;
    return showtime.seatsAvailable[seatNumber - 1] === 0;
  }

  /**
   * Reserves a seat if available.
   */
  async reserveSeat(showtimeId: number, seatNumber: number): Promise<boolean> {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });
    if (!showtime?.seatsAvailable || showtime.seatsAvailable[seatNumber - 1] === 1) {
      return false;
    }

    showtime.seatsAvailable[seatNumber - 1] = 1;
    await this.prisma.showtime.update({
      where: { id: showtimeId },
      data: { seatsAvailable: showtime.seatsAvailable },
    });

    this.logger.log(`Reserved seat ${seatNumber} for showtime ID ${showtimeId}.`);
    return true;
  }

  /**
   * Validates no overlapping showtimes exist for a given theater and time range.
   */
  private async validateNoOverlap(
    theater: string,
    startTime: Date,
    endTime: Date,
    showtimeIdToExclude?: number,
  ) {
    const overlappingShowtime = await this.prisma.showtime.findFirst({
      where: {
        theater,
        NOT: showtimeIdToExclude ? { id: showtimeIdToExclude } : undefined,
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });

    if (overlappingShowtime) {
      this.logger.warn(
        `Detected overlapping with showtime ID ${overlappingShowtime.id} in theater "${theater}".`,
      );
      throw new ConflictException('Showtime overlaps with existing scheduled showtime.');
    }
  }

   /**
   * Used internally by other services to fetch showtime details.
   */
   async findById(id: number) {
    return this.prisma.showtime.findUnique({
      where: { id },
    });
  }
}
