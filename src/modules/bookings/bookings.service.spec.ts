import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let showtimesService: ShowtimesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: ShowtimesService,
          useValue: {
            findById: jest.fn(),
            isSeatAvailable: jest.fn(),
            reserveSeat: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            booking: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createBooking', () => {
    const dto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: 'uuid-user-123',
    };

    const mockShowtime = {
      id: 1,
      movieId: 1,
      price: 10.0,
      theater: 'Cinema 1',
      startTime: new Date(),
      endTime: new Date(),
      seatsAvailable: [1,2,3,4,5],
    };

    it('should successfully create a booking', async () => {
      jest.spyOn(showtimesService, 'findById').mockResolvedValue(mockShowtime);
      jest.spyOn(showtimesService, 'isSeatAvailable').mockResolvedValue(true);
      jest.spyOn(showtimesService, 'reserveSeat').mockResolvedValue(true);
      jest.spyOn(prismaService.booking, 'create').mockResolvedValue({
        id: 'booking-uuid-123',
        ...dto,
      });

      const result = await service.createBooking(dto);
      expect(result).toEqual({ bookingId: 'booking-uuid-123' });
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      jest.spyOn(showtimesService, 'findById').mockResolvedValue(null);

      await expect(service.createBooking(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if seat is not available', async () => {
      jest.spyOn(showtimesService, 'findById').mockResolvedValue(mockShowtime);
      jest.spyOn(showtimesService, 'isSeatAvailable').mockResolvedValue(false);

      await expect(service.createBooking(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
