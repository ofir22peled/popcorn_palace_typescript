import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { config } from '../../../config';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let prisma: PrismaService;

  const mockPrisma = {
    showtime: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getShowtimeById', () => {
    it('should return a showtime if found', async () => {
      mockPrisma.showtime.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.getShowtimeById(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if showtime not found', async () => {
      mockPrisma.showtime.findUnique.mockResolvedValue(null);
      await expect(service.getShowtimeById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addShowtime', () => {
    const dto = {
      movieId: 1,
      theater: 'Theater A',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      price: 50,
    };

    it('should create and return a new showtime', async () => {
      mockPrisma.showtime.findFirst.mockResolvedValue(null);
      mockPrisma.showtime.create.mockResolvedValue({
        ...dto,
        seatsAvailable: Array(config.seatsPerShowtime).fill(0),
        id: 1,
      });

      const result = await service.addShowtime(dto);
      expect(result).toEqual({
        id: 1,
        movieId: dto.movieId,
        theater: dto.theater,
        startTime: dto.startTime,
        endTime: dto.endTime,
        price: dto.price,
      });
    });

    it('should throw ConflictException for overlapping showtimes', async () => {
      mockPrisma.showtime.findFirst.mockResolvedValue(dto);
      await expect(service.addShowtime(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteShowtime', () => {
    it('should delete a showtime', async () => {
      mockPrisma.showtime.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.showtime.delete.mockResolvedValue({ id: 1 });

      const result = await service.deleteShowtime(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      mockPrisma.showtime.findUnique.mockResolvedValue(null);
      await expect(service.deleteShowtime(99)).rejects.toThrow(NotFoundException);
    });
  });
});
