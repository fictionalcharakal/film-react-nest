import {
  GetFilmsResponseDto,
  ScheduleResponseDto,
} from '../films/dto/films.dto';
import { CreateOrderDto, OrderResponseDto } from '../order/dto/order.dto';

export interface FilmRepository {
  getAllFilms(): Promise<GetFilmsResponseDto>;
  getFilmSchedule(id: string): Promise<ScheduleResponseDto>;
  createOrder(order: CreateOrderDto): Promise<OrderResponseDto>;
}
