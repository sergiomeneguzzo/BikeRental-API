import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateInsuranceDto, UpdateInsuranceDto } from './insurances.dto';
import { InsuranceService } from './insurances.service';

const insuranceService = new InsuranceService();

export class InsuranceController {
  async create(req: Request, res: Response) {
    try {
      const dto = Object.assign(new CreateInsuranceDto(), req.body);
      await validateOrReject(dto);
      const result = await insuranceService.create(dto);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async findAll(_: Request, res: Response) {
    const data = await insuranceService.findAll();
    res.json(data);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await insuranceService.findById(id);
    if (!data) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(data);
  }

  async update(req: Request, res: Response) {
    try {
      const dto = Object.assign(new UpdateInsuranceDto(), req.body);
      await validateOrReject(dto);
      const data = await insuranceService.update(req.params.id, dto);
      if (!data) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async delete(req: Request, res: Response) {
    const data = await insuranceService.delete(req.params.id);
    if (!data) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).send();
  }
}
