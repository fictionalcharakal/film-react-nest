import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilmsDto {
  @IsString()
  id: string;

  @IsInt()
  rating: number;

  @IsString()
  director: string;

  @IsString()
  tags: string[];

  @IsString()
  image: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}

export class ScheduleDto {
  @IsString()
  id: string;

  @IsString()
  daytime: string;

  @IsInt()
  hall: number;

  @IsInt()
  rows: number;

  @IsInt()
  seats: number;

  @IsInt()
  price: number;

  @IsArray()
  @IsOptional()
  taken?: string[];
}

export class GetFilmsResponseDto {
  @IsInt()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilmsDto)
  items: FilmsDto[];
}

export class ScheduleResponseDto {
  @IsInt()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  items: ScheduleDto[];
}
