import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';

@Module({
  imports: [MoviesModule, ShowtimesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

