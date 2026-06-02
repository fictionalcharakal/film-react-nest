import {
  FilmsDto,
  GetFilmsResponseDto,
  ScheduleDto,
} from 'src/films/dto/films.dto';
import { CreateOrderDto, OrderResponseDto } from 'src/order/dto/order.dto';

export interface FilmRepository {
  getAllFilms(): Promise<GetFilmsResponseDto>;
  getFilmSchedule(id: string): Promise<ScheduleDto[]>;
  makeOrder(order: CreateOrderDto): Promise<OrderResponseDto>;
}

export interface FilmEntity extends FilmsDto {
  schedule: ScheduleDto[];
}
