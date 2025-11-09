import { Bay } from "./Bay";
import { Evidence } from "./Evidence";
import { Payment } from "./Payment";
import { Service } from "./Service";
import { Supply } from "./Supply";
import { appointmentStateFromId, AppointmentStateType } from "./types";
import { IUserMap, User } from "./User";
import { IVehicleMap, Vehicle } from "./Vehicle";

export interface IAppointmentMap {
  id: number;
  appointment_date: string;
  mechanic_id: number;
  bay_id: number;
  appointment_state_id: number;
  vehicle_id: number;
  Vehicles: IVehicleMap;
  Users: IUserMap;
}

interface IAppointment {
  id: number;
  date: Date;
  mechanic: User;
  bay: Bay;
  appointmentState: AppointmentStateType;
  vehicle: Vehicle;
  supplies: Supply[];
  evidences: Evidence[];
  services: Service[];
  payment: Payment | null;
}

export class Appointment {
  id: number;
  date: Date;
  mechanic: User;
  bay: Bay;
  appointmentState: AppointmentStateType;
  vehicle: Vehicle;
  supplies: Supply[];
  evidences: Evidence[];
  services: Service[];
  payment: Payment | null;

  constructor({ id, date, mechanic, bay, appointmentState, vehicle, supplies, evidences, services, payment }: IAppointment) {
    this.id = id;
    this.date = date;
    this.mechanic = mechanic;
    this.bay = bay;
    this.appointmentState = appointmentState;
    this.vehicle = vehicle;
    this.supplies = supplies;
    this.evidences = evidences;
    this.services = services;
    this.payment = payment;
  }

  static fromMap({ id, Users, appointment_date, mechanic_id, bay_id, appointment_state_id, vehicle_id, Vehicles }: IAppointmentMap): Appointment {
    return new Appointment({
      id: id,
      date: new Date(appointment_date),
      mechanic: User.fromMap(Users),
      bay: new Bay({ id: 1, name: "a" }),
      appointmentState: appointmentStateFromId(appointment_state_id),
      vehicle: Vehicle.fromMap(Vehicles),
      supplies: [],
      evidences: [],
      services: [],
      payment: null
    })
  }
}
