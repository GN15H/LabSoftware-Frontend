import { Appointment, IAppointmentMap } from "@/domain/models/Appointment";
import { ISupplyMap, Supply } from "@/domain/models/Supply";
import { AppointmentStateType } from "@/domain/models/types";
import axios from "axios";
import { ProcedureData } from "./MechanicGateway.types";

export class MechanicGatewayController {
  async fetchData() {
    const supplies = await this.fetchServices();
    const appointments = await this.fetchAppointments();
    return {
      supplies: supplies,
      appointments: appointments
    }
  }

  private async fetchServices() {
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
  private async fetchAppointments() {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const appointmentsRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/mechanic/' + profile['id'],
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

  async changeAppointmentState(appointmentId: number, appointmentState: AppointmentStateType) {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const updateReq = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/change-state/' + appointmentId.toString(),
      {
        appointment_state: appointmentState
      }
      , {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    return updateReq.status == 200;
  }

  async createProcedure(appointmentId: number, data: ProcedureData) {
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    const updateReq = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'appointments/procedures-services/' + appointmentId.toString(),
      {
        description: data.description,
        supplies: data.supplies.map(s => ({ supply_id: s.supplyId, amount: s.amount }))
      }
      , {
        headers: {
          Authorization: `Bearer ${profile['token']}`
        }
      }
    );
    return updateReq.status == 201;
  }
}
