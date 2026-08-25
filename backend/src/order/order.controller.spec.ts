import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { afterEach } from 'node:test';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;
  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    const orderDto: CreateOrderDto = {
      email: 'test@test.ru',
      phone: '+7 (000) 000-00-00',
      tickets: [
        {
          film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
          daytime: '2023-05-29T10:30:00.001Z',
          row: 2,
          seat: 5,
          price: 350,
        },
      ],
    };

    it('should delegate to OrderService.createOrder with the given DTO', async () => {
      const expected: OrderResponseDto = {
        total: 1,
        items: [
          {
            id: 'some-uuid',
            ...orderDto.tickets[0],
          },
        ],
      };
      service.createOrder.mockResolvedValue(expected);

      const result = await controller.createOrder(orderDto);

      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should propagate BadRequestException from the service (e.g. seat already taken)', async () => {
      const { BadRequestException } = await import('@nestjs/common');
      service.createOrder.mockRejectedValue(
        new BadRequestException({ error: 'Место 2:5 уже занято' }),
      );

      await expect(controller.createOrder(orderDto)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await controller.createOrder(orderDto);
      } catch (error) {
        expect(error.getResponse()).toEqual({ error: 'Место 2:5 уже занято' });
        expect(error.getStatus()).toBe(400);
      }
    });
  });
});
