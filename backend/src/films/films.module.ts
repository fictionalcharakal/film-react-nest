import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { FilmPostgresRepository } from '../repository/postgres.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: 'FILM_REPOSITORY',
      useClass: FilmPostgresRepository,
    },
  ],
})
export class FilmsModule {}
