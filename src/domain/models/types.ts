
export type UserType = 'admin' | 'mechanic' | 'user';

export type SpecialtyType = 'specialty';

export type SupplyType = 'supply';

export type AppointmentStateType = "pending" | "ongoing" | "completed" | "cancelled";

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
export function appointmentStateFromId(id: number): AppointmentStateType {
  switch (id) {
    case 1:
      return 'pending';
    case 2:
      return 'ongoing';
    case 3:
      return 'completed';
    case 4:
      return 'cancelled';
    default:
      return 'pending';
  }
}
