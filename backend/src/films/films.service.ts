import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from './schemas/Film.schema';
import { Model } from 'mongoose';
import { MongoRepository } from 'src/repository/mongo.repository';
import { GetFilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class FilmsService {
  private repository: MongoRepository<Film>;

  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {
    this.repository = new MongoRepository(this.filmModel);
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
