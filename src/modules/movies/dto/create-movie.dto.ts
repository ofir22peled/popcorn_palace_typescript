import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  releaseYear: number;
}