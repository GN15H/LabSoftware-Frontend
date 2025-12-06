import { Appointment, IAppointmentMap } from "@/domain/models/Appointment";
import { IServiceMap, Service } from "@/domain/models/Service";
import { Supplier, ISupplierMap } from "@/domain/models/Supplier";
import { ISupplyMap, Supply } from "@/domain/models/Supply";
import { IUserMap, User } from "@/domain/models/User";
import { IVehicleMap, Vehicle } from "@/domain/models/Vehicle";
import axios from "axios";
import { AppointmentData, SupplierData, SupplyData, UserData } from "@/types/AdminGateway.types";


export class AdminGatewayController {

  async fetchData() {
    const supplies = await this.fetchSupplies();
    const suppliers = await this.fetchSuppliers();
    const services = await this.fetchServices();
    const users = await this.fetchUsers();
    const vehicles = await this.fetchVehicles();
    const appointments = await this.fetchAppointments();

    return {
      supplies: supplies,
      suppliers: suppliers,
      services: services,
      users: users,
      vehicles: vehicles,
      appointments: appointments
    }
  }

  private async fetchSupplies() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const suppliesRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'supplies',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    const supplies: Supply[] = suppliesRequest.data.map((s: ISupplyMap) => Supply.fromMap(s))
    console.log(supplies);
    return supplies;
  }

  private async fetchSuppliers() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const suppliersRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'suppliers',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    const suppliers: Supplier[] = suppliersRequest.data.map((s: ISupplierMap) => Supplier.fromMap(s))
    console.log(suppliers);
    return suppliers;
  }

  private async fetchServices() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const servicesRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'services',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    const services: Service[] = servicesRequest.data.map((s: IServiceMap) => Service.fromMap(s))
    console.log(services);
    return services;
  }

  private async fetchUsers() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const usersRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'users',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    const users: User[] = usersRequest.data.map((s: IUserMap) => User.fromMap(s))
    console.log(users);
    return users;
  }

  private async fetchVehicles() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const vehiclesRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'vehicles',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    const vehicles: Vehicle[] = vehiclesRequest.data.map((s: IVehicleMap) => Vehicle.fromMap(s))
    console.log(vehicles);
    return vehicles;
  }

  private async fetchAppointments() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const appointmentsRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments',
      {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    console.log(appointmentsRequest);
    const appointments: Appointment[] = appointmentsRequest.data.map((s: IAppointmentMap) => Appointment.fromMap(s))
    console.log(appointments);
    return appointments;
    // return [];
  }


  async createService(name: string, price: bigint): Promise<Service | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'services', {
      name: name,
      price: price.toString()
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 201) return null;
    const newService: Service = Service.fromMap(request.data);
    return newService;
  }

  async updateService(id: number, name: string, price: bigint): Promise<Service | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'services/' + id.toString(), {
      name: name,
      price: price.toString()
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 200) return null;
    const newService: Service = Service.fromMap(request.data);
    return newService;
  }

  async removeService(id: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + 'services/' + id.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    return request.status == 200;
  }

  async createSupply(data: SupplyData): Promise<Supply | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'supplies', {
      name: data.name,
      amount: data.stock,
      min_stock: data.minStock,
      supplier_id: data.supplierId,
      supply_type_id: 1,
      price: data.price
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 201) return null;
    const newSupply: Supply = Supply.fromMap(request.data);
    return newSupply;
  }

  async updateSupply(id: number, data: SupplyData): Promise<Supply | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'supplies/' + id.toString(), {
      name: data.name,
      amount: data.stock,
      min_stock: data.minStock,
      supplier_id: data.supplierId,
      supply_type_id: 1,
      price: data.price
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 200) return null;
    const newSupply: Supply = Supply.fromMap(request.data);
    return newSupply;
  }


  async removeSupply(id: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + 'supplies/' + id.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    return request.status == 200;
  }

  async createSupplier(data: SupplierData): Promise<Supplier | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'suppliers', {
      name: data.name,
      phone: data.phone,
      email: data.email
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 201) return null;
    const newSupplier: Supplier = Supplier.fromMap(request.data);
    return newSupplier;
  }

  async updateSupplier(id: number, data: SupplierData): Promise<Supplier | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'suppliers/' + id.toString(), {
      name: data.name,
      phone: data.phone,
      email: data.email
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status != 200) return null;
    const newSupplier: Supplier = Supplier.fromMap(request.data);
    return newSupplier;
  }

  async removeSupplier(id: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + 'suppliers/' + id.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    return request.status == 200;
  }

  async createAppointment(value: AppointmentData): Promise<Appointment | null> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments', {
      appointment_date: value.date + "T" + value.hour + ":00.000Z",
      vehicle_id: value.vehicle,
      service: value.service
    }, {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    if (request.status == 201) {
      if (request.data['response'] != undefined && (request.data['response'] == 'No hay bahias' ||
        request.data['response'] == 'No hay mecanicos'))
        return null;
      else return Appointment.fromMap(request.data);
    } else {
      return null;
    }
  }

  async reassignAppointment(appointmentId: number, date: string, hour: string): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/' + appointmentId.toString(), {
      appointment_date: date + "T" + hour + ":00.000Z",
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

  async createUser(data: UserData): Promise<User | null> {
    const request = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'users', {
      dni: data.dni,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      userType: data.userType,
      birthDate: data.birthDate + 'T00:00:00.000Z'
    });
    if (request.status != 201) return null;
    const newUser: User = User.fromMap(request.data);
    return newUser;
  }

  async removeUser(id: number): Promise<boolean> {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const request = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + 'users/' + id.toString(), {
      headers: {
        Authorization: `Bearer ${profile['token']}`
      }
    })
    return request.status == 200;
  }
}
