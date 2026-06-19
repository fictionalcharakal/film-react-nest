import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import {
  FilmsDto,
  GetFilmsResponseDto,
  ScheduleResponseDto,
  ScheduleDto,
} from '../films/dto/films.dto';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
  TicketDto,
} from '../order/dto/order.dto';

export class MongoRepository<T> {
  constructor(private readonly model: Model<T>) {}
  async getAllFilms(): Promise<GetFilmsResponseDto> {
    const films = await this.model.find().lean().exec();
    return {
      total: films.length,
      items: films as unknown as FilmsDto[],
    };
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = (await this.model.findOne({ id }).lean().exec()) as any;

    if (!film) {
      return { total: 0, items: [] };
    }

    const schedule: ScheduleDto[] = (film.schedule || []).map((s: any) => ({
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken || [],
    }));

    return {
      total: schedule.length,
      items: schedule,
    };
  }

  async takeSeats(tickets: TicketDto[]) {
    for (const ticket of tickets) {
      const place = `${ticket.row}:${ticket.seat}`;
      const takenSeat = await this.model.findOne({
        id: ticket.film,
        schedule: {
          $elemMatch: {
            id: ticket.session,
            taken: place,
          },
        },
      });

      if (takenSeat) {
        throw new Error(
          `Место ${place} уже занято на сеансе ${ticket.session}`,
        );
      }

      const film = await this.model.findOneAndUpdate(
        { id: ticket.film },
        { $push: { 'schedule.$[element].taken': place } },
        { arrayFilters: [{ 'element.id': ticket.session }] },
      );
      if (!film) {
        throw new Error(
          `Фильм или сеанс не найден. filmId=${ticket.film}, sessionId=${ticket.session}`,
        );
      }
    }
    return tickets;
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    await this.takeSeats(orderData.tickets);
    const items: OrderResultDto[] = orderData.tickets.map(
      (ticket: TicketDto) => ({
        id: randomUUID(),
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      }),
    );
    return {
      total: items.length,
      items,
    };
  }
}
