import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Repository } from 'typeorm';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmPostgresRepository } from '../repository/postgres.repository';

@Injectable()
export class OrderService {
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

  async createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    try {
      const result = await this.repository.createOrder(orderData);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message?.includes('не найден')) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof Error && error.message?.includes('уже занято')) {
        throw new ConflictException(error.message);
      }

      console.error('Ошибка при создании заказа:', error);

      throw new InternalServerErrorException(
        'Произошла ошибка при создании заказа',
      );
    }
  }
}
