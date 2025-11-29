
export type UserType = 'admin' | 'mechanic' | 'user';

export type SpecialtyType = 'specialty';

export type SupplyType = 'supply';

export type AppointmentStateType = "pending" | "confirmed" | "ongoing" | "completed" | "paid" | "cancelled";

export type VehicleType = 'bike' | 'car' | 'bus';

export type EvidenceType = 'photo' | 'file';


export function vehicleFromId(id: number): VehicleType {
  switch (id) {
    case 1:
      return 'car';
    case 2:
      return 'bike';
    case 3:
      return 'bus';
    default:
      return 'car';
  }
}

export function userTypeFromId(id: number): UserType {
  switch (id) {
    case 1:
      return 'admin';
    case 2:
      return 'mechanic';
    case 3:
      return 'user';
    default:
      return 'user';
  }
}

export function getNextState(state: AppointmentStateType): AppointmentStateType {
  switch (state) {
    case "pending":
      return "confirmed";
    case "confirmed":
      return "ongoing";
    case "ongoing":
      return "completed"
    case "completed":
      return "paid"
    case "paid":
      return "paid";
    case "cancelled":
      return "cancelled";
  }
}

export function getProgressFromAppointmentState(state: AppointmentStateType): number {
  switch (state) {
    case "pending":
      return 0;
    case "confirmed":
      return 25;
    case "ongoing":
      return 50;
    case "completed":
      return 75;
    case "paid":
      return 100;
    case "cancelled":
      return 0;
  }
}

export function appointmentStateFromId(id: number): AppointmentStateType {
  switch (id) {
    case 2:
      return 'pending';
    case 3:
      return 'ongoing';
    case 4:
      return 'completed';
    case 5:
      return 'cancelled';
    case 6:
      return 'paid';
    case 7:
      return 'confirmed';
    default:
      return 'pending';
  }
}
