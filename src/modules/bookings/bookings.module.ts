import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [ShowtimesModule, MoviesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}