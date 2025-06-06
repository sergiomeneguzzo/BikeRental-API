import { Types } from 'mongoose';
import { BikeModel } from '../bike/bike.model';
import { LocationModel } from '../location/location.model';
import { UserModel } from '../user/user.model';
import {
  ConfirmReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
} from './booking.dto';
import { Reservation, ReservationStatus } from './booking.entity';
import { ReservationModel } from './booking.model';
import { sendReservationConfirmation } from '../services/reservation.service';
import {AccessoryModel} from "../accessories/accessories.model";
import {InsuranceModel} from "../insurances/insurances.model";

export class ReservationService {
  async create(dto: CreateReservationDto): Promise<Reservation> {
    const session = await ReservationModel.startSession();
    session.startTransaction();

    try {
      if (dto.userId) {
        const userCheck = await UserModel.findById(dto.userId).session(session);
        if (!userCheck) throw new Error('User non trovato');
      } else {
        if (!dto.guestEmail) throw new Error('guestEmail è obbligatorio se non c’è userId');
      }

      const pickupLoc = await LocationModel.findById(dto.pickupLocation).session(session);
      if (!pickupLoc) throw new Error('pickupLocation non valida');

      const dropoffLoc = await LocationModel.findById(dto.dropoffLocation).session(session);
      if (!dropoffLoc) throw new Error('dropoffLocation non valida');

      const bikesNotInLocation: { bikeId: string; currentLocId: string; currentLocName: string }[] = [];
      for (const bikeId of dto.items) {
        const bike = await BikeModel.findById(bikeId).session(session);
        if (!bike) throw new Error(`Bike non trovata: ${bikeId}`);
        if (bike.status !== 'available') throw new Error(`Bike ${bikeId} non è disponibile`);
        if (bike.currentLocation.toString() !== dto.pickupLocation) {
          bikesNotInLocation.push({
            bikeId: bike.id.toString(),
            currentLocId: bike.currentLocation.toString(),
            currentLocName: (bike.currentLocation as any).name,
          });
        }
      }
      if (bikesNotInLocation.length) {
        const dettagli = bikesNotInLocation
            .map(b => `- Bike ${b.bikeId} si trova in '${b.currentLocName}' (ID: ${b.currentLocId})`)
            .join('\n');
        throw new Error(`Alcune bici non sono presenti nella filiale selezionata.\n${dettagli}`);
      }

      const validInsurances: Types.ObjectId[] = [];
      if (dto.insurances?.length) {
        for (const insId of dto.insurances) {
          const ins = await InsuranceModel.findById(insId).session(session);
          if (!ins) throw new Error(`Insurance non trovata: ${insId}`);
          validInsurances.push(new Types.ObjectId(insId));
        }
      }

      const validAccessories: Types.ObjectId[] = [];
      if (dto.accessories?.length) {
        for (const accId of dto.accessories) {
          const acc = await AccessoryModel.findById(accId).session(session);
          if (!acc) throw new Error(`Accessory non trovato: ${accId}`);
          validAccessories.push(new Types.ObjectId(accId));
        }
      }

      let status = ReservationStatus.PENDING;
      if (dto.userId) {
        const u = await UserModel.findById(dto.userId).session(session);
        if (u?.isConfirmed) status = ReservationStatus.CONFIRMED;
      }

      const computedExtraFee = dto.pickupLocation !== dto.dropoffLocation ? 10 : 0;

      const [createdDoc] = await ReservationModel.create(
          [
            {
              userId: dto.userId ? new Types.ObjectId(dto.userId) : undefined,
              guestEmail: dto.userId ? undefined : dto.guestEmail,
              pickupDate: new Date(dto.pickupDate),
              pickupLocation: new Types.ObjectId(dto.pickupLocation),
              dropoffDate: new Date(dto.dropoffDate),
              dropoffLocation: new Types.ObjectId(dto.dropoffLocation),
              items: dto.items.map(id => new Types.ObjectId(id)),
              accessories: validAccessories,
              insurances: validInsurances,
              extraLocationFee: computedExtraFee,
              totalPrice: dto.totalPrice,
              status,
              reminderSent: false,
              paymentMethod: dto.paymentMethod,
            },
          ],
          { session }
      );

      await Promise.all(
          dto.items.map(id =>
              BikeModel.findOneAndUpdate(
                  { _id: id, status: 'available' },
                  { status: 'rented' },
                  { session }
              )
          )
      );

      await session.commitTransaction();
      session.endSession();

      const populated = await ReservationModel.findById(createdDoc._id)
          .populate('pickupLocation', 'name address')
          .populate('dropoffLocation', 'name address')
          .populate('items')
          .exec();

      if (status === ReservationStatus.CONFIRMED && dto.userId && populated) {
        const user = await UserModel.findById(dto.userId);
        await sendReservationConfirmation(user!.username!, populated, user!.toObject());
      } else {
        setTimeout(async () => {
          const resv = await ReservationModel.findById(createdDoc._id);
          if (resv?.status === ReservationStatus.PENDING) {
            resv.status = ReservationStatus.CANCELLED;
            await resv.save();
            await Promise.all(
                resv.items.map(id => BikeModel.findByIdAndUpdate(id, { status: 'available' }))
            );
          }
        }, 5 * 60 * 1000);
      }

      return populated!.toObject();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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

    const populatedResv = await ReservationModel.findById(resv._id)
        .populate('pickupLocation', 'name address')
        .populate('dropoffLocation', 'name address')
        .exec();
    if (!populatedResv) throw new Error('Errore nel ricaricare la prenotazione');

    await sendReservationConfirmation(
        user.username!,
        populatedResv.toObject(),
        user.toObject(),
    );

    return resv.toObject();
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return await ReservationModel.find({ userId: new Types.ObjectId(userId) });
  }

  async update(
      reservationId: string,
      dto: UpdateReservationDto,
      reqUserId: string
  ): Promise<Reservation> {
    const resv = await ReservationModel.findById(reservationId);
    if (!resv) throw new Error('Prenotazione non trovata');

    if (!resv.userId || resv.userId.toString() !== reqUserId)
      throw new Error('Accesso negato');

    if (![ReservationStatus.PENDING, ReservationStatus.CONFIRMED].includes(resv.status))
      throw new Error('Prenotazione non modificabile in questo stato');

    const now = new Date();
    const twoDaysBefore = new Date(resv.pickupDate);
    twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
    if (now > twoDaysBefore) {
      throw new Error('Non puoi più modificare la prenotazione a meno di 48h dal ritiro');
    }

    if (dto.pickupDate) resv.pickupDate = new Date(dto.pickupDate);
    if (dto.pickupLocation) resv.pickupLocation = new Types.ObjectId(dto.pickupLocation);
    if (dto.dropoffDate) resv.dropoffDate = new Date(dto.dropoffDate);
    if (dto.dropoffLocation) resv.dropoffLocation = new Types.ObjectId(dto.dropoffLocation);

    if (dto.items) {
      await Promise.all(
          resv.items.map((id) =>
              BikeModel.findByIdAndUpdate(id, { status: 'available' })
          )
      );

      for (const bikeId of dto.items) {
        const bike = await BikeModel.findById(bikeId);
        if (!bike) throw new Error(`Bike non trovata: ${bikeId}`);
        if (bike.status !== 'available')
          throw new Error(`Bike ${bikeId} non è disponibile`);
      }

      await Promise.all(
          dto.items.map((id) =>
              BikeModel.findByIdAndUpdate(id, { status: 'rented' })
          )
      );

      resv.items = dto.items.map((id) => new Types.ObjectId(id));
    }

    if (dto.accessories) {
      const validAccessories: Types.ObjectId[] = [];
      for (const accId of dto.accessories) {
        const accessory = await AccessoryModel.findById(accId);
        if (!accessory) throw new Error(`Accessory non trovato: ${accId}`);
        validAccessories.push(new Types.ObjectId(accId));
      }
      resv.accessories = validAccessories;
    }

    if (dto.insurances) {
      const validInsurances: Types.ObjectId[] = [];
      for (const insId of dto.insurances) {
        const insurance = await InsuranceModel.findById(insId);
        if (!insurance) throw new Error(`Insurance non trovata: ${insId}`);
        validInsurances.push(new Types.ObjectId(insId));
      }
      resv.insurances = validInsurances;
    }

    if (dto.totalPrice !== undefined) {
      resv.totalPrice = dto.totalPrice;
    }

    await resv.save();
    return resv.toObject();
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
