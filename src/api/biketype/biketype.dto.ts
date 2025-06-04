import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SizeDTO {
  @IsEnum(['S', 'M', 'L', 'XL'])
  sizeLabel: 'S' | 'M' | 'L' | 'XL';

  @IsNumber()
  minHeightCm: number;

  @IsNumber()
  maxHeightCm: number;
}

export class CreateBikeTypeDto {
  @IsEnum(['City', 'Mountain', 'Gravel', 'Road'])
  category: 'City' | 'Mountain' | 'Gravel' | 'Road';

  @IsEnum(['Muscolare', 'Elettrica'])
  motorType: 'Muscolare' | 'Elettrica';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDTO)
  sizes: SizeDTO[];

  @IsNumber()
  PriceHalfDay: number;
}
