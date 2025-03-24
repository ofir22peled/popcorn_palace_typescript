import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { PrismaModule } from '../../../prisma/prisma.module';

/**
 * Registers the controller and service for showtimes.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService], // Exported for use in BookingsModule
})
export class ShowtimesModule {}
