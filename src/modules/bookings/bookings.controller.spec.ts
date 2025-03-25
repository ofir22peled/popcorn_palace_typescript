import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            createBooking: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  describe('createBooking', () => {
    it('should call service.createBooking and return bookingId', async () => {
      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 5,
        userId: 'uuid-user-123',
      };

      jest.spyOn(service, 'createBooking').mockResolvedValue({ bookingId: 'booking-uuid-123' });

      const result = await controller.createBooking(dto);
      expect(service.createBooking).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ bookingId: 'booking-uuid-123' });
    });
  });
});
