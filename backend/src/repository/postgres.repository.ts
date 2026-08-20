// src/films/repositories/film.postgres.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
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
import { FilmRepository } from './film.repository.interface';

@Injectable()
export class FilmPostgresRepository implements FilmRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async getAllFilms(): Promise<GetFilmsResponseDto> {
    const films = await this.filmRepo.find();
    const items = films.map((film) => this.toFilmsDto(film));
    return {
      total: films.length,
      items: items,
    };
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!film) {
      return { total: 0, items: [] };
    }

    const items = (film.schedules ?? []).map(this.toScheduleDto);

    return {
      total: items.length,
      items: items,
    };
  }

  async takeSeats(tickets: TicketDto[]) {
    return await this.filmRepo.manager.transaction(async (manager) => {
      const scheduleRepo = manager.getRepository(Schedule);

      for (const ticket of tickets) {
        const place = `${ticket.row}:${ticket.seat}`;

        //ищем сеанс
        const schedule = await scheduleRepo.findOne({
          where: {
            id: ticket.session,
            filmId: ticket.film,
          },
        });

        if (!schedule) {
          throw new Error(
            `Фильм или сеанс не найден. filmId=${ticket.film}, sessionId=${ticket.session}`,
          );
        }

        //Превращаем строку в массив
        const takenArray = schedule.taken
          ? schedule.taken.split(',').filter(Boolean)
          : [];

        // Проверяем, есть ли место в taken
        if (takenArray.includes(place)) {
          throw new Error(
            `Место ${place} уже занято на сеансе ${ticket.session}`,
          );
        }

        takenArray.push(place);

        await scheduleRepo.update(
          { id: ticket.session },
          { taken: takenArray.join(',') },
        );
      }
      return tickets;
    });
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

  private toFilmsDto = (film: Film): FilmsDto => ({
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags:
      typeof film.tags === 'string' && film.tags
        ? film.tags.split(',').filter(Boolean)
        : [],
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
  });

  private toScheduleDto = (schedule: Schedule): ScheduleDto => ({
    id: schedule.id,
    daytime: new Date(schedule.daytime).toISOString(),
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken:
      typeof schedule.taken === 'string' && schedule.taken
        ? schedule.taken.split(',').filter(Boolean)
        : [],
  });
}
