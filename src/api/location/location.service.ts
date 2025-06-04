import { CreateLocationDto, UpdateLocationDto } from './location.dto';
import { LocationModel } from './location.model';

export class LocationService {
  async create(data: CreateLocationDto) {
    return await LocationModel.create(data);
  }

  async findAll() {
    return await LocationModel.find();
  }

  async findById(id: string) {
    return await LocationModel.findById(id);
  }

  async update(id: string, data: UpdateLocationDto) {
    return await LocationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await LocationModel.findByIdAndDelete(id);
  }
}
