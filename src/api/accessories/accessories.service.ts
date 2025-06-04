import { CreateAccessoryDto, UpdateAccessoryDto } from './accessories.dto';
import { AccessoryModel } from './accessories.model';

export class AccessoryService {
  async create(dto: CreateAccessoryDto) {
    return await AccessoryModel.create(dto);
  }

  async findAll() {
    return await AccessoryModel.find();
  }

  async findById(id: string) {
    return await AccessoryModel.findById(id);
  }

  async update(id: string, dto: UpdateAccessoryDto) {
    return await AccessoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return await AccessoryModel.findByIdAndDelete(id);
  }
}
