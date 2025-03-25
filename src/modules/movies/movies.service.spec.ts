import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    movie: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMovies', () => {
    it('should return all movies', async () => {
      const movies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
      mockPrismaService.movie.findMany.mockResolvedValue(movies);

      const result = await service.getMovies();
      expect(result).toEqual(movies);
      expect(prismaService.movie.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('addMovie', () => {
    const newMovieDto = {
      title: 'New Movie',
      genre: 'Action',
      duration: 120,
      rating: 8,
      releaseYear: new Date().getFullYear(),
    };

    it('should successfully add a new movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);
      mockPrismaService.movie.create.mockResolvedValue(newMovieDto);

      const result = await service.addMovie(newMovieDto);
      expect(result).toEqual(newMovieDto);
      expect(prismaService.movie.create).toHaveBeenCalledWith({ data: newMovieDto });
    });

    it('should throw ConflictException if movie already exists', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(newMovieDto);

      await expect(service.addMovie(newMovieDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if releaseYear is in the future', async () => {
      newMovieDto.releaseYear = new Date().getFullYear() + 1;

      mockPrismaService.movie.findUnique.mockResolvedValue(null);
      await expect(service.addMovie(newMovieDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMovie', () => {
    const movieTitle = 'Existing Movie';
    const updateDto = { rating: 9 };

    it('should successfully update a movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue({ title: movieTitle });
      mockPrismaService.movie.update.mockResolvedValue({ title: movieTitle, ...updateDto });

      const result = await service.updateMovie(movieTitle, updateDto);
      expect(result).toEqual({ title: movieTitle, ...updateDto });
      expect(prismaService.movie.update).toHaveBeenCalledWith({
        where: { title: movieTitle },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);

      await expect(service.updateMovie(movieTitle, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if releaseYear is invalid', async () => {
      updateDto['releaseYear'] = new Date().getFullYear() + 1;
      mockPrismaService.movie.findUnique.mockResolvedValue({ title: movieTitle });

      await expect(service.updateMovie(movieTitle, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteMovie', () => {
    const movieTitle = 'Movie to Delete';

    it('should successfully delete a movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue({ title: movieTitle });
      mockPrismaService.movie.delete.mockResolvedValue({ title: movieTitle });

      const result = await service.deleteMovie(movieTitle);
      expect(result).toEqual({ title: movieTitle });
      expect(prismaService.movie.delete).toHaveBeenCalledWith({
        where: { title: movieTitle },
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);

      await expect(service.deleteMovie(movieTitle)).rejects.toThrow(NotFoundException);
    });
  });
});
