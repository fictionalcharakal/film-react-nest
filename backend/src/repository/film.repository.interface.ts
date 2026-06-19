import {
  FilmsDto,
  GetFilmsResponseDto,
  ScheduleDto,
} from '../films/dto/films.dto';
import { CreateOrderDto, OrderResponseDto } from '../order/dto/order.dto';

export interface FilmRepository {
  getAllFilms(): Promise<GetFilmsResponseDto>;
  getFilmSchedule(id: string): Promise<ScheduleDto[]>;
  makeOrder(order: CreateOrderDto): Promise<OrderResponseDto>;
}

export interface FilmEntity extends FilmsDto {
  schedule: ScheduleDto[];
}
