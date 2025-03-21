/**
 * Controller handling API requests for showtimes.
 */
import { Controller, Get, Post, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShowtimesService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get('all')
  getAllShowtimes() {
    return this.showtimesService.getShowtimes();
  }

  @Get(':id')
  getShowtimeById(@Param('id') id: string) {
    return this.showtimesService.getShowtimeById(Number(id));
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createShowtime(@Body() showtime: CreateShowtimeDto) {
    return this.showtimesService.addShowtime(showtime);
  }

  @Post('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateShowtime(
    @Param('id') id: string,
    @Body() updatedShowtime: UpdateShowtimeDto
  ) {
    return this.showtimesService.updateShowtime(Number(id), updatedShowtime);
  }

  @Delete(':id')
  deleteShowtime(@Param('id') id: string) {
    return this.showtimesService.deleteShowtime(Number(id));
  }
}
