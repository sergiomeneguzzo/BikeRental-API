import { BikeModel, BikeDocument } from './bike.model';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';
import { Bike, BikeStatus } from './bike.entity';
import { NotFoundError } from '../../errors/not-found';
import { UserInputError } from '../../errors/user-input.error';

export class BikeService {
  async create(createBikeDto: CreateBikeDTO): Promise<Bike> {
    if (createBikeDto.serialNumber) {
      const existingBike = await BikeModel.findOne({ serialNumber: createBikeDto.serialNumber });
      if (existingBike) {
        throw new UserInputError(`Bike with serial number ${createBikeDto.serialNumber} already exists.`);
      }
    }

    const bikeData = {
      bikeType: createBikeDto.bikeType,
      serialNumber: createBikeDto.serialNumber,
      currentLocation: createBikeDto.currentLocationId,
      status: createBikeDto.status || BikeStatus.AVAILABLE,
      notes: createBikeDto.notes,
    };

    const newBike = await BikeModel.create(bikeData);
    return newBike.toObject() as Bike;
  }

  async findAll(queryDto: BikeQueryDTO): Promise<{ bikes: Bike[], total: number, page: number, limit: number }> {
    const { locationId, bikeTypeId, status, serialNumber, page = 1, limit = 10 } = queryDto;
    const query: any = {};

    if (locationId) query.currentLocation = locationId;
    if (bikeTypeId) query.bikeType = bikeTypeId;
    //if (size) query.size = size;
    if (status) query.status = status;
    if (serialNumber) query.serialNumber = { $regex: serialNumber, $options: 'i' };

    const skip = (page - 1) * limit;

    const bikes = await BikeModel.find(query)
      .populate('bikeType', 'name category power')
      .populate('currentLocation', 'name address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await BikeModel.countDocuments(query);

    return {
        bikes: bikes.map(b => b.toObject() as Bike),
        total,
        page,
        limit
    };
  }

  async findOne(id: string): Promise<Bike> {
    const bike = await BikeModel.findById(id)
      .populate('bikeType')
      .populate('currentLocation')
      .exec();
    if (!bike) {
      throw new NotFoundError();
    }
    return bike.toObject() as Bike;
  }

  async update(id: string, updateBikeDto: UpdateBikeDTO): Promise<Bike> {
    const bike = await BikeModel.findById(id);
    if (!bike) {
      throw new NotFoundError();
    }

    if (updateBikeDto.status === BikeStatus.AVAILABLE && bike.status === BikeStatus.RENTED) {
        throw new UserInputError('Cannot manually set a rented bike to available. Use booking return process.');
    }
    if (bike.status === BikeStatus.RENTED && updateBikeDto.status !== BikeStatus.MAINTENANCE && updateBikeDto.status !== BikeStatus.UNAVAILABLE) {
        const allowedToUpdateWhenRented = Object.keys(updateBikeDto).every(key => ['notes', 'status'].includes(key));
        if (!allowedToUpdateWhenRented) {
             throw new UserInputError(`Bike ${id} is currently rented and cannot be modified extensively. Only notes or status to maintenance/unavailable is allowed.`);
        }
    }

    if (updateBikeDto.serialNumber && updateBikeDto.serialNumber !== bike.serialNumber) {
      const existingBike = await BikeModel.findOne({
        serialNumber: updateBikeDto.serialNumber,
        _id: { $ne: id },
      });
      if (existingBike) {
        throw new UserInputError(`Bike with serial number ${updateBikeDto.serialNumber} already exists.`);
      }
    }

    Object.assign(bike, updateBikeDto);
    await bike.save();
    const updatedBikePopulated = await BikeModel.findById(id)
                                        .populate('bikeType')
                                        .populate('currentLocation')
                                        .exec();
    return updatedBikePopulated!.toObject() as Bike;
  }

  async remove(id: string): Promise<{ id: string; message: string }> {
    const bike = await BikeModel.findById(id);
    if (!bike) {
      throw new NotFoundError();
    }
    if (bike.status === BikeStatus.RENTED) {
        throw new UserInputError(`Cannot delete bike ${id} as it is currently rented.`);
    }

    await bike.deleteOne();
    return { id, message: 'Bike removed successfully.' };
  }

  async getInventoryCount(locationId: string, bikeTypeId?: string, status: BikeStatus = BikeStatus.AVAILABLE): Promise<number> {
    const query: any = { currentLocation: locationId, status };
    if (bikeTypeId) query.bikeType = bikeTypeId;
    return BikeModel.countDocuments(query);
  }
}

export default new BikeService();