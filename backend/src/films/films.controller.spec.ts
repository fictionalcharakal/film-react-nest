import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { afterEach } from 'node:test';
import { GetFilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  const mockFilmsService = {
    getAllFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('should return the result from FilmsService.getAllFilms()', async () => {
      const expected: GetFilmsResponseDto = {
        total: 2,
        items: [
          {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
            rating: 4.5,
            director: 'Test Director',
            tags: ['Драма'],
            image: '/images/a.jpg',
            cover: '/images/a-cover.jpg',
            title: 'Test Film',
            about: 'about',
            description: 'description',
          },
        ] as any,
      };
      service.getAllFilms.mockResolvedValue(expected);

      const result = await controller.getAllFilms();

      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should propagate errors thrown by the service', async () => {
      service.getAllFilms.mockRejectedValue(new Error('db down'));

      await expect(controller.getAllFilms()).rejects.toThrow('db down');
    });
  });

  describe('getFilmSchedule', () => {
    it('should call FilmsService.getFilmSchedule with the given id', async () => {
      const id = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
      const expected: ScheduleResponseDto = { total: 0, items: [] };
      service.getFilmSchedule.mockResolvedValue(expected);

      const result = await controller.getFilmSchedule(id);

      expect(service.getFilmSchedule).toHaveBeenCalledWith(id);
      expect(service.getFilmSchedule).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should propagate exceptions thrown by the service (e.g. NotFoundException)', async () => {
      service.getFilmSchedule.mockRejectedValue(new Error('Нет расписания'));

      await expect(controller.getFilmSchedule('some-id')).rejects.toThrow(
        'Нет расписания',
      );
    });
  });
});
