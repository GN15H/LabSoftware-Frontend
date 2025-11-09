import { Appointment } from "@/domain/models/Appointment";
import { Bay } from "@/domain/models/Bay";
import { Payment } from "@/domain/models/Payment";
import { Service } from "@/domain/models/Service";
import { User } from "@/domain/models/User";
import { Vehicle } from "@/domain/models/Vehicle";

const bay: Bay = new Bay({ id: 0, name: 'a' })

const mechanic: User = new User({ id: 0, dni: 'jjj', name: 'Carlos', lastName: 'Rodriguez', email: 'email@gmail.com', birthDate: new Date(), userType: 'mechanic', specialties: ['specialty'] });

export const service: Service = new Service({ id: 0, name: 'lavadito' });

export const vehicle: Vehicle = new Vehicle({ id: 0, plateNumber: 'epw395', brand: 'renault', vehicleType: 'car', ownerId: 0 });

export const appointments: Appointment[] = [
  new Appointment({ id: 0, date: new Date(), mechanic: mechanic, bay: bay, appointmentState: 'pending', vehicle: vehicle, supplies: [], evidences: [], services: [service], payment: null })
]

const payment: Payment = new Payment({ id: 0, price: 50000, appointmentId: 0 })

export const appointmentsStory: Appointment[] = [
  new Appointment({ id: 0, date: new Date(), mechanic: mechanic, bay: bay, appointmentState: 'pending', vehicle: vehicle, supplies: [], evidences: [], services: [service], payment: payment })
]

