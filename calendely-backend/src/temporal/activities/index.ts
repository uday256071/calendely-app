import { sendBookingConfirmationEmail } from "../../mailer/booking.mailer.js";
import { RegenerateHostSlotsInput, regenerateHostSlots as runSlotGeneration } from "../../services/slot.service.js";


export async function regenerateHostSlotsActivity(input: RegenerateHostSlotsInput) {
    await runSlotGeneration(input); // here actually the service function is called
}

export async function sendBookingConfirmationEmailActivity(bookingId: number) {
    await sendBookingConfirmationEmail(bookingId);
}