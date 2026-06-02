import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from './schemas/Film.schema';
import { Model } from 'mongoose';
import { MongoRepository } from 'src/repository/mongo.repository';
import { GetFilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

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
    return this.repository.getFilmSchedule(id);
  }
}
