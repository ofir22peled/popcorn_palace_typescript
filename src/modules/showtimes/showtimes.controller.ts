import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

/**
 * Controller responsible for handling showtime-related HTTP requests.
 * Delegates business logic to the ShowtimesService.
 */
@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  /**
   * POST /showtimes
   * Creates a new showtime in the database with validation.
   * Responds with the created showtime details excluding seatsAvailable.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Showtime created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Showtime overlaps with existing one' })
  @ApiBody({ type: CreateShowtimeDto })
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
  @ApiOperation({ summary: 'Get a showtime by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Showtime retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Showtime not found' })
  @ApiParam({ name: 'id', description: 'ID of the showtime to retrieve' })
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
  @ApiOperation({ summary: 'Update a showtime by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Showtime updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Showtime not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Showtime overlaps with existing one' })
  @ApiParam({ name: 'id', description: 'ID of the showtime to update' })
  @ApiBody({ type: UpdateShowtimeDto })
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
  @ApiOperation({ summary: 'Delete a showtime by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Showtime deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Showtime not found' })
  @ApiParam({ name: 'id', description: 'ID of the showtime to delete' })
  deleteShowtime(@Param('id') id: string) {
    return this.showtimesService.deleteShowtime(+id);
  }
}
