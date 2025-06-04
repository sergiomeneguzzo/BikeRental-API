import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { BikeStatus } from './bike.entity';

export class CreateBikeDTO {
  @IsNotEmpty()
  @IsMongoId()
  bikeTypeId: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @IsNotEmpty()
  @IsMongoId()
  currentLocationId: string;

  @IsOptional()
  @IsEnum(BikeStatus)
  status?: BikeStatus = BikeStatus.AVAILABLE; // Default se non fornito

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateBikeDTO {
  @IsOptional()
  @IsMongoId()
  bikeTypeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @IsOptional()
  @IsMongoId()
  currentLocationId?: string;

  @IsOptional()
  @IsEnum(BikeStatus)
  status?: BikeStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class BikeQueryDTO { // Per filtrare la lista di biciclette
  @IsOptional()
  @IsMongoId()
  locationId?: string;

  @IsOptional()
  @IsMongoId()
  bikeTypeId?: string;

  @IsOptional()
  @IsEnum(BikeStatus)
  status?: BikeStatus;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}