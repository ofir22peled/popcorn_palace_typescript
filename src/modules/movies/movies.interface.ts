/**
 * Interface representing a movie entity.
 * This interface defines the shape of a movie object as used throughout the application.
 */
export interface Movie {
    id: number;
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
  }
  