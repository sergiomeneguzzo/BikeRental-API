import { CreateInsuranceDto, UpdateInsuranceDto } from './insurances.dto';
import { InsuranceModel } from './insurances.model';

export class InsuranceService {
  async create(dto: CreateInsuranceDto) {
    return await InsuranceModel.create(dto);
  }

  async findAll() {
    return await InsuranceModel.find();
  }

  async findById(id: string) {
    return await InsuranceModel.findById(id);
  }

  async update(id: string, dto: UpdateInsuranceDto) {
    return await InsuranceModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return await InsuranceModel.findByIdAndDelete(id);
  }
}
