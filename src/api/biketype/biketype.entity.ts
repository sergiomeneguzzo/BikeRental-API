export interface BikeType {
  category: 'City' | 'Mountain' | 'Gravel' | 'Road';
  motorType: 'Muscolare' | 'Elettrica';
  sizes: {
    sizeLabel: 'S' | 'M' | 'L' | 'XL';
    minHeightCm: number;
    maxHeightCm: number;
  }[];
  PriceHalfDay: number;
  createdAt: Date;
  updatedAt: Date;
}
