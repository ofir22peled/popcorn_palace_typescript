import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

/**
 * Controller responsible for handling showtime-related HTTP requests.
 * Delegates business logic to the ShowtimesService.
 */
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  /**
   * POST /showtimes
   * Creates a new showtime in the database with validation.
   * Responds with the created showtime details excluding seatsAvailable.
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createShowtime(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.addShowtime(dto);
  }

  /**
   * GET /showtimes/:id
   * Retrieves a single showtime by its ID from the database.
   * Responds with the showtime details excluding seatsAvailable.
   */
  @Get(':id')
  async getShowtimeById(@Param('id') id: string) {
    const showtime = await this.showtimesService.getShowtimeById(+id);
    // Excluding seatsAvailable in the response
    const { seatsAvailable, ...rest } = showtime;
    return rest;
  }

  /**
   * POST /showtimes/update/:id
   * Updates an existing showtime by ID.
   * Responds with the updated showtime details.
   */
  @Post('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateShowtime(
    @Param('id') id: string,
    @Body() dto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.updateShowtime(+id, dto);
  }

  /**
   * DELETE /showtimes/:id
   * Deletes a showtime by its ID.
   * Responds with a 204 status if deletion is successful.
   */
  @Delete(':id')
  deleteShowtime(@Param('id') id: string) {
    return this.showtimesService.deleteShowtime(+id);
  }
}
