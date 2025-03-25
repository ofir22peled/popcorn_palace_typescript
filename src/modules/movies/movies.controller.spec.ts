import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    addMovie: jest.fn(),
    getMovies: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createMovie', () => {
    it('should call addMovie in service', async () => {
      const dto: CreateMovieDto = {
        title: 'Movie 1',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2024,
      };

      mockMoviesService.addMovie.mockResolvedValue(dto);
      const result = await controller.createMovie(dto);

      expect(service.addMovie).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('getAllMovies', () => {
    it('should call getMovies in service', async () => {
      const movies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
      mockMoviesService.getMovies.mockResolvedValue(movies);

      const result = await controller.getAllMovies();

      expect(service.getMovies).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  describe('updateMovie', () => {
    it('should call updateMovie in service', async () => {
      const movieTitle = 'Movie 1';
      const dto: UpdateMovieDto = { rating: 9 };

      mockMoviesService.updateMovie.mockResolvedValue({
        title: movieTitle,
        rating: 9,
      });

      const result = await controller.updateMovie(movieTitle, dto);

      expect(service.updateMovie).toHaveBeenCalledWith(movieTitle, dto);
      expect(result).toEqual({
        title: movieTitle,
        rating: 9,
      });
    });
  });

  describe('deleteMovie', () => {
    it('should call deleteMovie in service', async () => {
      const movieTitle = 'Movie 1';
      mockMoviesService.deleteMovie.mockResolvedValue({ title: movieTitle });

      const result = await controller.deleteMovie(movieTitle);

      expect(service.deleteMovie).toHaveBeenCalledWith(movieTitle);
      expect(result).toEqual({ title: movieTitle });
    });
  });
});
