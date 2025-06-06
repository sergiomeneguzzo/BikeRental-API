import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayMinSize,
  ValidateIf, IsArray,
} from 'class-validator';

export class CreateReservationDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ValidateIf((o) => !o.userId)
  @IsString()
  @IsNotEmpty()
  guestEmail?: string;

  @IsNotEmpty()
  @IsDateString()
  pickupDate: string;

  @IsMongoId()
  pickupLocation: string;

  @IsNotEmpty()
  @IsDateString()
  dropoffDate: string;

  @IsMongoId()
  dropoffLocation: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  items: string[];

  @IsOptional()
  @IsArray()
  accessories?: string[];

  @IsOptional()
  @IsArray()
  insurances?: string[];

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  extraLocationFee?: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class ConfirmReservationDto {
  @IsMongoId()
  reservationId: string;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  pickupDate?: string;

  @IsOptional()
  @IsMongoId()
  pickupLocation?: string;

  @IsOptional()
  @IsDateString()
  dropoffDate?: string;

  @IsOptional()
  @IsMongoId()
  dropoffLocation?: string;

  @IsOptional()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  items?: string[];

  @IsOptional()
  @IsArray()
  accessories?: string[];

  @IsOptional()
  @IsArray()
  insurances?: string[];

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
