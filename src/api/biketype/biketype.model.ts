import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  sizeLabel: {
    type: String,
    enum: ['S', 'M', 'L', 'XL'],
    required: true,
  },
  minHeightCm: Number,
  maxHeightCm: Number,
});

const bikeTypeSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['City', 'Mountain', 'Gravel', 'Road'],
    required: true,
  },
  motorType: {
    type: String,
    enum: ['Muscolare', 'Elettrica'],
    required: true,
  },
  sizes: [sizeSchema],
  PriceHalfDay: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bikeTypeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const BikeTypeModel = mongoose.model('BikeType', bikeTypeSchema);
