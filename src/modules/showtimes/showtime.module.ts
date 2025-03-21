import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';

@Module({
  controllers: [ShowtimesController], // ✅ Registers the controller
  providers: [ShowtimesService], // ✅ Registers the service
  exports: [ShowtimesService], // ✅ (Optional) If another module needs it
})
export class ShowtimesModule {}
