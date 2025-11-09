import { Appointment, IAppointmentMap } from "@/domain/models/Appointment";
import { IVehicleMap, Vehicle } from "@/domain/models/Vehicle";
import axios from "axios";
import { VehicleFormValidator } from "./ClientGateway.validator";
import { getIdByVehicleItem, VehicleData, VehicleDataErrors } from "./ClientGateway.types";
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

    const services: Service[] = servicesRequest.data.map((s: IServiceMap) => Service.fromMap(s))
    return services;
  }


}
