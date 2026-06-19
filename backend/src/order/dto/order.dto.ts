import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

//TODO реализовать DTO для /orders
export class CreateOrderDto {
  @IsString()
  phone: string;
  @IsString()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class TicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsInt()
  price: number;
}

export class OrderResultDto extends TicketDto {
  @IsString()
  id: string;
}

export class OrderResponseDto {
  @IsInt()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderResultDto)
  items: OrderResultDto[];
}
