import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  ConfirmReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
} from './booking.dto';
import { ReservationService } from './booking.service';

const service = new ReservationService();

export class ReservationController {
  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateReservationDto, req.body);
      await validateOrReject(dto);

      const reqUser = (req as any).user;
      if (reqUser) {
        dto.userId = reqUser._id;
      }

      const reservation = await service.create(dto);
      res.status(201).json(reservation);
    } catch (err: any) {
      res.status(400).json({ error: err.message || err });
    }
  }

  async confirm(req: Request, res: Response) {
    try {
      const dto = plainToInstance(ConfirmReservationDto, req.body);
      await validateOrReject(dto);

      const reqUser = (req as any).user;
      console.log('user:', reqUser);
      if (!reqUser) {
        res.status(401).json({ error: 'Non autenticato' });
        return;
      }
      if (!reqUser.isConfirmed) {
        res.status(403).json({ error: 'Utente non confermato' });
        return;
      }

      const updated = await service.confirm(dto, reqUser.id);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || err });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const reqUser = (req as any).user;
      if (!reqUser) {
        res.status(401).json({ error: 'Non autenticato' });
        return;
      }
      if (!reqUser.isConfirmed) {
        res.status(403).json({ error: 'Utente non confermato' });
      }

      const list = await service.findByUser(reqUser._id);
      res.json(list);
    } catch (err: any) {
      res.status(400).json({ error: err.message || err });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const dto = plainToInstance(UpdateReservationDto, req.body);
      await validateOrReject(dto);

      const reqUser = (req as any).user;
      if (!reqUser) {
        res.status(401).json({ error: 'Non autenticato' });
        return;
      }
      if (!reqUser.isConfirmed) {
        res.status(403).json({ error: 'Utente non confermato' });
        return;
      }

      const updated = await service.update(
        req.params.id,
        dto,
        reqUser.id.toString(),
      );
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || err });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const reqUser = (req as any).user;
      if (!reqUser) {
        res.status(401).json({ error: 'Non autenticato' });
        return;
      }
      if (!reqUser.isConfirmed) {
        res.status(403).json({ error: 'Utente non confermato' });
        return;
      }

      const cancelled = await service.cancel(
        req.params.id,
        reqUser.id.toString(),
      );
      res.json(cancelled);
    } catch (err: any) {
      res.status(400).json({ error: err.message || err });
    }
  }
}
