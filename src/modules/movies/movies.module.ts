import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

/**
 * Module for movie-related operations.
 */
@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService], // exported in case other modules need movie data
})
export class MoviesModule {}
