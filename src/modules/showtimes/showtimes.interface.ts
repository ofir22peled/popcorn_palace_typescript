/**
 * Defines the structure of a showtime object.
 * Used internally in the service layer.
 */
export interface Showtime {
    id: number;
    movieId: number;
    theaterId: number;
    startTime: string;
    endTime: string;
    price: number;
    seats: number[]; // 0 = available, 1 = reserved
  }
  