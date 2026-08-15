import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { FilmRepository } from '../repository/film.repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILM_REPOSITORY')
    private readonly repository: FilmRepository,
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    try {
      const result = await this.repository.createOrder(orderData);
      return result;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message?.includes('не найден') ||
          error.message?.includes('уже занято'))
      ) {
        throw new BadRequestException({ error: error.message });
      }

      console.error('Ошибка при создании заказа:', error);

      throw new InternalServerErrorException({
        error: 'Произошла ошибка при создании заказа',
      });
    }
  }
}
