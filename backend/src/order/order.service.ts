import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/Film.schema';
import { MongoRepository } from '../repository/mongo.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private repository: MongoRepository<Film>;
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {
    this.repository = new MongoRepository(this.filmModel);
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
