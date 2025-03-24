import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { MoviesModule } from '../movies/movies.module';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ShowtimesModule, MoviesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
