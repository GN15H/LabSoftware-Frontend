import { Service } from "@/domain/models/Service";
import { Vehicle } from "@/domain/models/Vehicle";

export type VehicleItem = 'Moto' | 'Carro' | 'Bus';
export const VehicleItems: VehicleItem[] = [
  'Moto',
  'Carro',
  'Bus'
];
export function getIdByVehicleItem(value: VehicleItem): number {
  switch (value) {
    case "Moto":
      return 2;
    case "Carro":
      return 1;
    case "Bus":
      return 3;
  }
}

export type VehicleDataFields =
  'plate' |
  'model' |
  'year' |
  'brand' |
  'type';

export type VehicleData = {
  plate: string,
  model: string,
  year: string,
  brand: string,
  type: VehicleItem
}

export type VehicleDataErrors = {
  plate: string | null,
  model: string | null,
  year: string | null,
  brand: string | null,
  type: string | null,
}

export type AppointmentDataFields =
  'vehicle' |
  'service' |
  'date' |
  'hour' |
  'description';

export type AppointmentData = {
  vehicle: number | null,
  service: number | null,
  date: string,
  hour: string,
  description: string
}

export type RescheduleDataFields =
  'date' | 'hour' | 'reason';

export type RescheduleData = {
  date: string,
  hour: string,
  reason: string
}

export type PaymentDataFiels =
  'number' |
  'exp' |
  'cvv' |
  'holder' |
  'type';

export type PaymentData = {
  number: string,
  exp: string,
  cvv: string,
  holder: string,
  type: string
}


