import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsNumber, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO to validate the input for creating a new movie.
 */
export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty or just spaces' })
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiProperty({ example: 'Action' })
  @IsString()
  @IsNotEmpty({ message: 'Genre cannot be empty or just spaces' })
  @Transform(({ value }) => value.trim())
  genre: string;

  @ApiProperty({ example: 148 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 8.8 })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 2010 })
  @IsInt()
  @Min(1900)
  releaseYear: number; // Validation for current year done dynamically in service
}
