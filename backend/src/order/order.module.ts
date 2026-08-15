import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmPostgresRepository } from '../repository/postgres.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrderService,
    {
      provide: 'FILM_REPOSITORY',
      useClass: FilmPostgresRepository,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
