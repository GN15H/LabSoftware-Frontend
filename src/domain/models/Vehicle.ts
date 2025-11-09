import { vehicleFromId, VehicleType } from "./types";

export interface IVehicleMap {
  id: number;
  brand: string;
  number_plate: string;
  series: string;
  vehicle_type_id: number
  owner_id: number;
}

interface IVehicle {
  id: number;
  plateNumber: string;
  brand: string;
  vehicleType: VehicleType;
  series: string;
  ownerId: number;
}

export class Vehicle {
  id: number;
  plateNumber: string;
  brand: string;
  vehicleType: VehicleType;
  series: string;
  ownerId: number;

  constructor({ id, series, plateNumber, brand, vehicleType, ownerId }: IVehicle) {
    this.id = id;
    this.plateNumber = plateNumber;
    this.brand = brand;
    this.vehicleType = vehicleType;
    this.ownerId = ownerId;
    this.series = series;
  }

  static fromMap({ id, owner_id, brand, number_plate, series, vehicle_type_id }: IVehicleMap): Vehicle {
    return new Vehicle({
      id: id,
      plateNumber: number_plate,
      brand: brand,
      series: series,
      ownerId: owner_id,
      vehicleType: vehicleFromId(vehicle_type_id)
    })
  }
}
