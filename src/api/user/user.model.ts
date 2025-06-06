import mongoose from 'mongoose';
import { User as iUser, UserRole } from './user.entity';

export const userSchema = new mongoose.Schema<iUser>({
  firstName: String,
  lastName: String,
  username: String,
  picture: String,
  phone: String,
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
    required: true,
  },
  isConfirmed: { type: Boolean, default: false },
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.isConfirmed;
    return ret;
  },
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = mongoose.model<iUser>('User', userSchema);
