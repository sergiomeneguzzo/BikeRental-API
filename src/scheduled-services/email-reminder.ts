import {ReservationModel} from "../api/booking/booking.model";
import {ReservationStatus} from "../api/booking/booking.entity";
import {UserModel} from "../api/user/user.model";
import {sendReminderEmail} from "../api/services/reminder.service";

export const processReminders = async (): Promise<void> => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const windowStart = new Date(oneHourLater.getTime() - 60 * 1000);
    const windowEnd = new Date(oneHourLater.getTime() + 60 * 1000);

    const upcomingReservations = await ReservationModel.find({
        status: ReservationStatus.CONFIRMED,
        reminderSent: false,
        pickupDate: { $gte: windowStart, $lte: windowEnd },
    });

    for (const resv of upcomingReservations) {
        let targetEmail: string | null = null;

        if (resv.userId) {
            const user = await UserModel.findById(resv.userId);
            if (user && user.username) {
                targetEmail = user.username;
            }
        }

        if (!targetEmail && resv.guestEmail) {
            targetEmail = resv.guestEmail;
        }

        if (!targetEmail) {
            continue;
        }

        try {
            await sendReminderEmail(targetEmail, resv._id.toString(), resv.pickupDate);
            resv.reminderSent = true;
            await resv.save();
        } catch (err) {
            console.error(`Errore inviando reminder per prenotazione ${resv._id}:`, err);
        }
    }
};