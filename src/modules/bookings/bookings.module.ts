import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { PrismaModule } from '../../../prisma/prisma.module';

/**
 * Module for managing bookings-related components.
 */
@Module({
  imports: [PrismaModule, ShowtimesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
