import { Appointment } from "@/domain/models/Appointment";
import { Vehicle } from "@/domain/models/Vehicle";
import { useEffect, useState } from "react";
import { AppointmentData, PaymentData, RescheduleData, VehicleData } from "./ClientGateway.types";
import { useRouter } from "next/navigation";
import { service } from "./mock/mockData";
import { ClientGatewayController } from "./ClientGateway.controller";
import { Service } from "@/domain/models/Service";

export function useClientGateway() {
  const controller = new ClientGatewayController();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; sev: "success" | "info" | "warning" | "error" }>({ open: false, message: "", sev: "info" });

  // Citas y vehículos de ejemplo (mock)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Dialog states
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [reasignOpen, setReasignOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [budgetApprovedOpen, setBudgetApprovedOpen] = useState(false);
  const [budgetRejectedOpen, setBudgetRejectedOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Forms
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    plate: '',
    model: '',
    year: '',
    brand: '',
    type: 'Carro'
  });

  const [apptData, setApptData] = useState<AppointmentData>({
    vehicle: null,
    service: null,
    date: '',
    hour: '10:00',
    description: ''
  });

  const [reassignData, setReassignData] = useState<RescheduleData>({
    date: '',
    hour: '10:00',
    reason: ''
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    number: '',
    exp: '',
    cvv: '',
    holder: '',
    type: ''
  });

  // Chat
  const [chatMsgs, setChatMsgs] = useState<Array<{ who: "bot" | "user"; text: string }>>([
    { who: "bot", text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Handlers principales
  const router = useRouter();
  const logout = () => {
    try {
      localStorage.removeItem('profile');
      sessionStorage.clear();
    } catch { }
    router.replace('/'); // vuelve al login
  };

  const submitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (controller.validateVehicle(vehicleData) != null) return;
    const created = await controller.createVehicle(vehicleData)
    setLoading(false);
    if (created) {
      window.location.reload();
      setVehicleOpen(false);
      setSnack({ open: true, sev: "success", message: "Vehículo registrado correctamente" });
    }
  };

  const submitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const created = await controller.createAppointment(apptData);
    setLoading(false);
    if (created) {
      setSnack({ open: true, sev: "success", message: "Cita agendada con éxito" });
      setTimeout(() => window.location.reload(), 3000);
    }
    else
      setSnack({ open: true, sev: "error", message: "Error agendando la cita, no hay recursos disponibles" });
    setApptOpen(false);
  };

  const executeCancelAppointment = async (id: number) => {
    setLoading(true);
    const deleted = await controller.cancelAppointment(id);
    setLoading(false);
    if (deleted) {
      const newAppointments = [...appointments];
      const appt = newAppointments.findIndex(a => a.id == id);
      newAppointments.splice(appt, 1);
      setAppointments(newAppointments);
      setSnack({ open: true, sev: "success", message: "Cita cancelada exitosamente" });
    } else {
      setSnack({ open: true, sev: "error", message: "No se pudo cancelar la cita" });
    }
    setCancelOpen(false);
  };

  const submitApproveBudget = async (id: number) => {
    setLoading(true);
    const approved = await controller.approveBudget(id);
    setLoading(false);
    if (approved) {
      setSnack({ open: true, sev: "success", message: "Presupuesto aprobado exitosamente" });
    } else {
      setSnack({ open: true, sev: "error", message: "No se pudo aprobar el presupuesto" });
    }
    setBudgetApprovedOpen(false);
    setTimeout(() => window.location.reload(), 2000);
  }

  const submitReasign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppointment == null) return;
    setLoading(true);
    const updated = await controller.reassignAppointment(reassignData, selectedAppointment.id);
    if (updated) {
      const newAppointments = [...appointments];
      const appt = newAppointments.findIndex(a => a.id == selectedAppointment.id);
      newAppointments[appt].date = new Date(reassignData.date + "T" + reassignData.hour + ":00.000Z")
      setAppointments(newAppointments);
      setSnack({ open: true, sev: "success", message: "Solicitud de reasignación enviada" });
    } else {
      setSnack({ open: true, sev: "error", message: "No se pudo reasignar la cita" });
    }
    setLoading(false);
    setReasignOpen(false);
  };

  const processPayment = async (appointment: Appointment) => {
    setLoading(true);
    const created = await controller.createPayment(appointment, paymentData);
    setLoading(false);
    if (created) {
      setSnack({ open: true, sev: "success", message: "¡Pago procesado exitosamente!" });
    } else {
      setSnack({ open: true, sev: "error", message: "No se pudo procesar el pago" });
    }
    setPaymentOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1800);
  };

  const showApproveBudget = () => setBudgetApprovedOpen(true);
  const showRejectBudget = () => setBudgetRejectedOpen(true);

  const sendChat = (text?: string) => {
    const t = (text ?? chatInput).trim();
    if (!t) return;
    setChatMsgs((m) => [...m, { who: "user", text: t }]);
    setChatInput("");
    setTimeout(() => {
      // respuestas simples de demo
      const lower = t.toLowerCase();
      let resp = "Entiendo. ¿Te ayudo con precios, horarios o servicios?";
      if (lower.includes("precio")) resp = "Cambio de aceite $80,000, Frenos $250,000, Alineación $100,000";
      if (lower.includes("horario")) resp = "L-V 8:00-18:00, Sáb 8:00-16:00";
      if (lower.includes("servicio")) resp = "Aceite, Revisión, Frenos, Alineación, Diagnóstico, Afinación";
      setChatMsgs((m) => [...m, { who: "bot", text: resp }]);
    }, 700);
  };

  useEffect(() => {
    const profileUnserialized = localStorage.getItem('profile')
    if (profileUnserialized == null) {
      router.replace('/');
      return;
    }
    const profile = JSON.parse(profileUnserialized);
    if (profile['userType'] == 'admin')
      router.replace('/admin');
    else if (profile['userType'] == 'mechanic')
      router.replace('/mecanico');

    const fetchData = async () => {
      setLoading(true);
      const data = await controller.fetchData();
      setVehicles(data.vehicles);
      setAppointments(data.appointments);
      setServices(data.services);
      setLoading(false);
    };
    console.log("tamo eperando");
    console.log("y entonce eto ke e pue dedel huj", setSelectedAppointment);
    fetchData();
  }, []);

  return {
    isLoading, setLoading,
    snack, setSnack,
    appointments, setAppointments,
    vehicles, setVehicles,
    services, setServices,
    vehicleOpen, setVehicleOpen,
    apptOpen, setApptOpen,
    reasignOpen, setReasignOpen,
    cancelOpen, setCancelOpen,
    paymentOpen, setPaymentOpen,
    budgetApprovedOpen, setBudgetApprovedOpen,
    budgetRejectedOpen, setBudgetRejectedOpen,
    chatOpen, setChatOpen,
    vehicleData, setVehicleData,
    apptData, setApptData,
    reassignData, setReassignData,
    paymentData, setPaymentData,
    chatMsgs, setChatMsgs,
    chatInput, setChatInput,
    selectedAppointment, setSelectedAppointment,
    logout,
    submitVehicle,
    submitAppointment,
    submitApproveBudget,
    executeCancelAppointment,
    submitReasign,
    processPayment,
    showApproveBudget,
    showRejectBudget,
    sendChat
  }

}
