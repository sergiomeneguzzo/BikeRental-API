import { Types } from 'mongoose';
import { BikeModel } from '../bike/bike.model';
import { LocationModel } from '../location/location.model';
import { UserModel } from '../user/user.model';
import { ConfirmReservationDto, CreateReservationDto } from './booking.dto';
import { Reservation, ReservationStatus } from './booking.entity';
import { ReservationModel } from './booking.model';
import { sendConfirmationEmail } from '../services/email.service';
import { sendReservationConfirmation } from '../services/reservation.service';

export class ReservationService {
  async create(dto: CreateReservationDto): Promise<Reservation> {
    if (dto.userId) {
      const user = await UserModel.findById(dto.userId);
      if (!user) throw new Error('User non trovato');
    } else {
      if (!dto.guestEmail)
        throw new Error('guestEmail è obbligatorio se non c’è userId');
    }

    const pickupLoc = await LocationModel.findById(dto.pickupLocation);
    if (!pickupLoc) throw new Error('pickupLocation non valida');

    const dropoffLoc = await LocationModel.findById(dto.dropoffLocation);
    if (!dropoffLoc) throw new Error('dropoffLocation non valida');

    for (const bikeId of dto.items) {
      const bike = await BikeModel.findById(bikeId);
      if (!bike) throw new Error(`Bike non trovata: ${bikeId}`);
      if (bike.status !== 'available')
        throw new Error(`Bike ${bikeId} non è disponibile`);
    }

    let status = ReservationStatus.PENDING;
    if (dto.userId) {
      const user = await UserModel.findById(dto.userId);
      if (user && user.isConfirmed) {
        status = ReservationStatus.CONFIRMED;
      }
    }

    const newRes = await ReservationModel.create({
      userId: dto.userId ? new Types.ObjectId(dto.userId) : undefined,
      guestEmail: dto.userId ? undefined : dto.guestEmail,
      pickupDate: new Date(dto.pickupDate),
      pickupLocation: new Types.ObjectId(dto.pickupLocation),
      dropoffDate: new Date(dto.dropoffDate),
      dropoffLocation: new Types.ObjectId(dto.dropoffLocation),
      items: dto.items.map((id) => new Types.ObjectId(id)),
      extraLocationFee: dto.extraLocationFee ?? 0,
      totalPrice: dto.totalPrice,
      status,
      reminderSent: false,
      paymentMethod: dto.paymentMethod,
    });

    if (status === ReservationStatus.CONFIRMED) {
      await Promise.all(
        dto.items.map((id) =>
          BikeModel.findByIdAndUpdate(id, { status: 'rented' }),
        ),
      );
      if (dto.userId) {
        const user = await UserModel.findById(dto.userId);
        if (user) {
          await sendReservationConfirmation(
            user.username!,
            newRes.id.toString(),
          );
        }
      }
    } else {
      if (dto.guestEmail) {
        await sendConfirmationEmail(dto.guestEmail, newRes._id.toString());
      }
    }

    return newRes.toObject();
  }

  async confirm(
    dto: ConfirmReservationDto,
    reqUserId: string,
  ): Promise<Reservation> {
    const resv = await ReservationModel.findById(dto.reservationId);
    if (!resv) throw new Error('Prenotazione non trovata');
    if (resv.status !== ReservationStatus.PENDING)
      throw new Error('Prenotazione non è pending');

    const user = await UserModel.findById(reqUserId);
    if (!user) throw new Error('Utente non trovato');
    if (!user.isConfirmed) throw new Error('Utente non è confermato');

    resv.userId = new Types.ObjectId(reqUserId);
    resv.guestEmail = undefined;
    resv.status = ReservationStatus.CONFIRMED;
    await resv.save();

    await Promise.all(
      resv.items.map((id) =>
        BikeModel.findByIdAndUpdate(id, { status: 'rented' }),
      ),
    );

    await sendReservationConfirmation(user.username!, resv.id.toString());

    return resv.toObject();
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return await ReservationModel.find({ userId: new Types.ObjectId(userId) });
  }

  async cancel(reservationId: string, reqUserId: string): Promise<Reservation> {
    const resv = await ReservationModel.findById(reservationId);
    if (!resv) throw new Error('Prenotazione non trovata');
    if (!resv.userId || resv.userId.toString() !== reqUserId)
      throw new Error('Accesso negato');
    if (
      ![ReservationStatus.CONFIRMED, ReservationStatus.PENDING].includes(
        resv.status,
      )
    ) {
      throw new Error('Prenotazione non cancellabile in questo stato');
    }

    const now = new Date();
    const twoDaysBefore = new Date(resv.pickupDate);
    twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
    if (now > twoDaysBefore)
      throw new Error('Non puoi cancellare a meno di 48h dal pickup');

    resv.status = ReservationStatus.CANCELLED;
    await resv.save();

    await Promise.all(
      resv.items.map((id) =>
        BikeModel.findByIdAndUpdate(id, { status: 'available' }),
      ),
    );

    return resv.toObject();
  }
}
