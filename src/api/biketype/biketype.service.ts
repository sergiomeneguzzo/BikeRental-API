import { CreateBikeTypeDto } from './biketype.dto';
import { BikeTypeModel } from './biketype.model';

export class BikeTypeService {
  async create(data: CreateBikeTypeDto) {
    return await BikeTypeModel.create(data);
  }

  async findAll() {
    return await BikeTypeModel.find();
  }

  async findById(id: string) {
    return await BikeTypeModel.findById(id);
  }

  async update(id: string, data: Partial<CreateBikeTypeDto>) {
    return await BikeTypeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await BikeTypeModel.findByIdAndDelete(id);
  }
}
