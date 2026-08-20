import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  async createOrder(
    @Body() orderData: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return await this.orderService.createOrder(orderData);
  }
}
