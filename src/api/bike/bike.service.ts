import { BikeModel, BikeDocument } from './bike.model';
import { CreateBikeDTO, UpdateBikeDTO, BikeQueryDTO } from './bike.dto';
import { Bike, BikeStatus } from './bike.entity';
import { NotFoundError } from '../../errors/not-found';
import { UserInputError } from '../../errors/user-input.error'; // Potresti creare questo errore per duplicati, etc.
//import { BookingModel } from '../booking/booking.model'; // Per controllare se una bici è in una prenotazione attiva

export class BikeService {
  async create(createBikeDto: CreateBikeDTO): Promise<Bike> {
    // Controlla se il serialNumber è già in uso, se fornito
    if (createBikeDto.serialNumber) {
      const existingBike = await BikeModel.findOne({ serialNumber: createBikeDto.serialNumber });
      if (existingBike) {
        throw new UserInputError(`Bike with serial number ${createBikeDto.serialNumber} already exists.`);
      }
    }

    const bikeData = {
      bikeType: createBikeDto.bikeTypeId,
      //size: createBikeDto.size,
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
    if (serialNumber) query.serialNumber = { $regex: serialNumber, $options: 'i' }; // Case-insensitive search

    const skip = (page - 1) * limit;

    const bikes = await BikeModel.find(query)
      .populate('bikeType', 'name category power') // Popola con alcuni campi di BikeType
      .populate('currentLocation', 'name address') // Popola con alcuni campi di Location
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

    // Se si tenta di cambiare lo stato a "available" ma la bici è in una prenotazione attiva
    if (updateBikeDto.status === BikeStatus.AVAILABLE && bike.status === BikeStatus.RENTED) {
        // Questa logica dovrebbe essere gestita dal processo di riconsegna della prenotazione
        throw new UserInputError('Cannot manually set a rented bike to available. Use booking return process.');
    }
     // Non permettere di modificare una bici se è attualmente noleggiata (status RENTED)
     // a meno che la modifica non sia solo per 'notes' o per cambiarne lo stato (es. da RENTED a MAINTENANCE post-noleggio con problemi)
    if (bike.status === BikeStatus.RENTED && updateBikeDto.status !== BikeStatus.MAINTENANCE && updateBikeDto.status !== BikeStatus.UNAVAILABLE) {
        // Verifica se si sta cercando di modificare campi diversi da 'notes' o 'status'
        const allowedToUpdateWhenRented = Object.keys(updateBikeDto).every(key => ['notes', 'status'].includes(key));
        if (!allowedToUpdateWhenRented) {
             throw new UserInputError(`Bike ${id} is currently rented and cannot be modified extensively. Only notes or status to maintenance/unavailable is allowed.`);
        }
    }


    // Controlla unicità del serialNumber se viene modificato e non è nullo
    if (updateBikeDto.serialNumber && updateBikeDto.serialNumber !== bike.serialNumber) {
      const existingBike = await BikeModel.findOne({
        serialNumber: updateBikeDto.serialNumber,
        _id: { $ne: id }, // Escludi la bici corrente
      });
      if (existingBike) {
        throw new UserInputError(`Bike with serial number ${updateBikeDto.serialNumber} already exists.`);
      }
    }

    Object.assign(bike, updateBikeDto);
    await bike.save();
    // Ripopola dopo il salvataggio per ottenere i dati aggiornati referenziati
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

    // Impedisci la cancellazione se la bici è in una prenotazione attiva o futura
    /*const activeOrFutureBooking = await BookingModel.findOne({
        'items.assignedBike': id, // Se tieni traccia della bici assegnata
        status: { $in: ['confirmed', 'active'] } // Assicurati che questi siano gli stati rilevanti
    });*/


    // Oppure, se non assegni la bici in anticipo, controlla se il TIPO/TAGLIA di questa bici
    // è richiesto in prenotazioni attive/future nella sua location e non ci sono altre bici
    // di quel tipo/taglia per coprire quelle prenotazioni. Questa è più complessa.
    // Per semplicità, assumiamo che si possa cancellare solo se non è RENTED.
    if (bike.status === BikeStatus.RENTED) {
        throw new UserInputError(`Cannot delete bike ${id} as it is currently rented.`);
    }

    // Potresti voler aggiungere ulteriori controlli, ad esempio se ci sono prenotazioni future
    // che contano su questa specifica bici (se il sistema pre-assegna le bici).

    await bike.deleteOne(); // Usa deleteOne() o remove() a seconda della versione di Mongoose e preferenze
    return { id, message: 'Bike removed successfully.' };
  }

  // Funzione per l'inventario rapido
  async getInventoryCount(locationId: string, bikeTypeId?: string, status: BikeStatus = BikeStatus.AVAILABLE): Promise<number> {
    const query: any = { currentLocation: locationId, status };
    if (bikeTypeId) query.bikeType = bikeTypeId;
    //if (size) query.size = size;
    return BikeModel.countDocuments(query);
  }
}

export default new BikeService();