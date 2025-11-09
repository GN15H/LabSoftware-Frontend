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

  const [snack, setSnack] = useState<{ open: boolean; message: string; sev: "success" | "info" | "warning" | "error" }>({ open: false, message: "", sev: "info" });

  // Citas y vehículos de ejemplo (mock)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);

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
    service: service,
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
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      sessionStorage.clear();
    } catch { }
    router.replace('/'); // vuelve al login
  };

  const submitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (controller.validateVehicle(vehicleData) != null) return;
    const created = await controller.createVehicle(vehicleData)
    if (created) {
      window.location.reload();
      setVehicleOpen(false);
      setSnack({ open: true, sev: "success", message: "Vehículo registrado correctamente" });
    }
  };

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setApptOpen(false);
    setSnack({ open: true, sev: "success", message: "Cita agendada con éxito" });
  };

  const executeCancelAppointment = () => {
    setCancelOpen(false);
    setSnack({ open: true, sev: "success", message: "Cita cancelada exitosamente" });
  };

  const submitReasign = (e: React.FormEvent) => {
    e.preventDefault();
    setReasignOpen(false);
    setSnack({ open: true, sev: "success", message: "Solicitud de reasignación enviada" });
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSnack({ open: true, sev: "info", message: "Procesando pago..." });
    setTimeout(() => {
      setPaymentOpen(false);
      setSnack({ open: true, sev: "success", message: "¡Pago procesado exitosamente!" });
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
    const fetchData = async () => {
      const data = await controller.fetchData();
      setVehicles(data.vehicles);
      setAppointments(data.appointments);
      setServices(data.services);
    };
    console.log("tamo eperando");
    fetchData();
  }, []);

  return {
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
    logout,
    submitVehicle,
    submitAppointment,
    executeCancelAppointment,
    submitReasign,
    processPayment,
    showApproveBudget,
    showRejectBudget,
    sendChat
  }

}
