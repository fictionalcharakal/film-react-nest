import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsInt()
  @IsPositive()
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
