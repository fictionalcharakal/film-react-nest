import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetFilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { isUUID } from 'class-validator';
import { FilmRepository } from '../repository/film.repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILM_REPOSITORY')
    private readonly repository: FilmRepository,
  ) {}

  async getAllFilms(): Promise<GetFilmsResponseDto> {
    return this.repository.getAllFilms();
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException(`Некорректный формат id.`);
      }
      const schedule = await this.repository.getFilmSchedule(id);
      if (schedule.total === 0) {
        throw new NotFoundException(`Нет расписания для фильма ${id}`);
      }
      return schedule;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Произошла ошибка при получении расписания фильма',
      );
    }
  }
}
