import { Appointment, IAppointmentMap } from "@/domain/models/Appointment";
import { IVehicleMap, Vehicle } from "@/domain/models/Vehicle";
import axios from "axios";
import { VehicleFormValidator } from "./ClientGateway.validator";
import { AppointmentData, getIdByVehicleItem, PaymentData, RescheduleData, VehicleData, VehicleDataErrors } from "./ClientGateway.types";
import { headers } from "next/headers";
import { IServiceMap, Service } from "@/domain/models/Service";


export class ClientGatewayController {
  private readonly vehicleValidator = new VehicleFormValidator();

  async createVehicle(value: VehicleData): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'vehicles', {
      number_plate: value.plate,
      brand: value.brand,
      series: value.model,
      vehicle_type_id: getIdByVehicleItem(value.type),
      owner_id: profile['id']
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })

    return request.status == 201;
  }

  async createPayment(appointment: Appointment, paymentData: PaymentData): Promise<boolean> {
    let value: bigint = BigInt(0);
    for (const s of appointment.services) {
      value = value + s.price;
    }
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    console.log({
      total: value.toString(),
      date: (new Date()).toISOString(),
      method: paymentData.type,
      appointment_id: appointment.id
    })
    // return false;
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'payments', {
      total: value.toString(),
      date: (new Date()).toISOString(),
      method: paymentData.type,
      appointment_id: appointment.id
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })

    return request.status == 201;
  }

  async approveBudget(index: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/accept/' + index.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })

    return request.status == 200;
  }

  async createAppointment(value: AppointmentData): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    console.log("ejem?????")
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments', {
      appointment_date: value.date + "T" + value.hour + ":00.000Z",
      vehicle_id: value.vehicle,
      service: value.service
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    console.log("la hijueputa mierda", request);
    if (request.status == 201) {
      if (request.data['response'] != undefined && (request.data['response'] == 'No hay bahias' ||
        request.data['response'] == 'No hay mecanicos'))
        return false;
      else return true;
    } else {
      return false;
    }
  }

  async reassignAppointment(value: RescheduleData, appointmentId: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/' + appointmentId.toString(), {
      appointment_date: value.date + "T" + value.hour + ":00.000Z",
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })

    if (request.status != 200) return false;

    if (request.data['response'] != undefined) {
      if (request.data['response'] == 'No hay bahias' ||
        request.data['response'] == 'No hay mecanicos')
        return false
    }
    return true;
  }


  async cancelAppointment(id: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/' + id.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    return request.status == 200;
  }

  validateVehicle(value: VehicleData): VehicleDataErrors | null {
    const errors = this.vehicleValidator.validateAll(value);
    const hasErrors = Object.values(errors).some(e => e != null);
    if (hasErrors) return errors;
    return null;
  }

  async fetchData() {
    const vehicles = await this.fetchVehicles();
    const appointments = await this.fetchAppointments();
    const services = await this.fetchServices();
    return {
      vehicles: vehicles,
      appointments: appointments,
      services: services
    }

  }

  private async fetchAppointments(): Promise<Appointment[]> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const appointmentsRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/user/' + profile['id'],
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    console.log("cual es la maricada pues gonorrea", appointmentsRequest);
    const appointments: Appointment[] = appointmentsRequest.data.map((a: IAppointmentMap) => Appointment.fromMap(a))
    console.log(appointments);
    return appointments;
  }

  private async fetchVehicles(): Promise<Vehicle[]> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const vehiclesRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'vehicles/user/' + profile['id'],
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );

    console.log(vehiclesRequest);
    const vehicles: Vehicle[] = vehiclesRequest.data.map((v: IVehicleMap) => Vehicle.fromMap(v))
    console.log(vehicles);
    return vehicles;
  }

  private async fetchServices(): Promise<Service[]> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const servicesRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'services',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    console.log("la requ", servicesRequest);
    const services: Service[] = servicesRequest.data.map((s: IServiceMap) => Service.fromMap(s))
    return services;
  }


}
