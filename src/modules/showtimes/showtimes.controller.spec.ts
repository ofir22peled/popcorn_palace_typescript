import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockService = {
    addShowtime: jest.fn(),
    getShowtimeById: jest.fn(),
    updateShowtime: jest.fn(),
    deleteShowtime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createShowtime', () => {
    it('should create a showtime', async () => {
      const dto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Theater A',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        price: 50,
      };
      mockService.addShowtime.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.createShowtime(dto);
      expect(service.addShowtime).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('getShowtimeById', () => {
    it('should return showtime details', async () => {
      const showtime = {
        id: 1,
        movieId: 1,
        theater: 'Theater A',
        startTime: '2025-04-01T10:00:00Z',
        endTime: '2025-04-01T12:00:00Z',
        price: 50,
        seatsAvailable: [0, 1, 0],
      };
      mockService.getShowtimeById.mockResolvedValue(showtime);

      const result = await controller.getShowtimeById('1');
      expect(result).toEqual({
        id: showtime.id,
        movieId: showtime.movieId,
        theater: showtime.theater,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
      });
    });
  });

  describe('updateShowtime', () => {
    it('should update showtime', async () => {
      const dto: UpdateShowtimeDto = { price: 60 };
      mockService.updateShowtime.mockResolvedValue({ id: 1, price: 60 });

      const result = await controller.updateShowtime('1', dto);
      expect(service.updateShowtime).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, price: 60 });
    });
  });

  describe('deleteShowtime', () => {
    it('should delete showtime', async () => {
      mockService.deleteShowtime.mockResolvedValue({});

      const result = await controller.deleteShowtime('1');
      expect(service.deleteShowtime).toHaveBeenCalledWith(1);
      expect(result).toEqual({});
    });
  });
});
