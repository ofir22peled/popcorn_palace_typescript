import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../../../prisma/prisma.module'; // Provides PrismaService

/**
 * MoviesModule sets up the controller and service for movie-related operations.
 */
@Module({
  imports: [PrismaModule], // Enables access to PrismaService in MoviesService
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService], // Exported in case another module (e.g. Bookings) needs movie info
})
export class MoviesModule {}
