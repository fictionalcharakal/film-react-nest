import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetFilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { isUUID } from 'class-validator';
import { FilmPostgresRepository } from '../repository/postgres.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsService {
  private repository: FilmPostgresRepository;

  constructor(
    @InjectRepository(Film)
    private filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
  ) {
    this.repository = new FilmPostgresRepository(
      this.filmRepo,
      this.scheduleRepo,
    );
  }

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
