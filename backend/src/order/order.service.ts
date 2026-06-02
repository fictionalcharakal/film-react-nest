import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/schemas/Film.schema';
import { MongoRepository } from 'src/repository/mongo.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private repository: MongoRepository<Film>;
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {
    this.repository = new MongoRepository(this.filmModel);
  }

  createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    return this.repository.createOrder(orderData);
  }
}
