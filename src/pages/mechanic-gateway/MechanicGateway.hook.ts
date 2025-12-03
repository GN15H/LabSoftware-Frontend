import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { MechanicGatewayController } from "./MechanicGateway.controller";
import { Appointment } from "@/domain/models/Appointment";
import { AppointmentStateType } from "@/domain/models/types";
import { Supply } from "@/domain/models/Supply";
import { AppointmentSupplies, ProcedureData } from "./MechanicGateway.types";

export function useMechanicGateway() {

  const controller = new MechanicGatewayController();

  const STATE_NAMES: Record<number, { key: string; label: string }> = {
    1: { key: "recibido", label: "Recibido" },
    2: { key: "diagnostico", label: "Diagnóstico" },
    3: { key: "presupuesto", label: "Presupuesto" },
    4: { key: "proceso", label: "En Proceso" },
    5: { key: "listo", label: "Listo" },
    6: { key: "entregado", label: "Entregado" },
  };

  const [procedureData, setProcedureData] = useState<ProcedureData>({
    description: '',
    supplies: []
  })

  const [selectedAppointment, setSelectedAppointment] = useState<number>(0);
  const [workflowState, setWorkflowState] = useState<number>(1); // 1..6
  const [waitingBudget, setWaitingBudget] = useState<boolean>(false);
  const [budgetRejected, setBudgetRejected] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);

  const [serviceDialogOpen, setServiceDialogOpen] = useState<boolean>(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState<boolean>(false);
  const [photoStage, setPhotoStage] = useState<string>(STATE_NAMES[1].key);
  const [photos, setPhotos] = useState<Array<{ name: string; url?: string }>>([]);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Citas simuladas ----

  useEffect(() => {
    const profileUnserialized = localStorage.getItem('profile')
    if (profileUnserialized == null) {
      router.replace('/');
      return;
    }
    const profile = JSON.parse(profileUnserialized);
    if (profile['userType'] == 'admin')
      router.replace('/admin');
    else if (profile['userType'] == 'user')
      router.replace('/cliente');

    const fetchData = async () => {
      const data = await controller.fetchData();
      setAppointments(data.appointments);
      setSupplies(data.supplies);
      // setVehicles(data.vehicles);
      // setAppointments(data.appointments);
      // setServices(data.services);
      // console.log(data.appointments);
      // console.log("los servis", data.services);
    };
    console.log("tamo eperando");
    // console.log("y entonce eto ke e pue dedel huj", setSelectedAppointment);
    fetchData();
  }, [])

  // ---- Handlers del workflow ----
  const advanceWorkflowState = async (appointmentId: number, state: AppointmentStateType) => {
    const success = await controller.changeAppointmentState(appointmentId, state);
    if (success)
      window.location.reload();
    else
      alert("No se pudo hacer la solicitud");
  };

  const createProcedures = async (appointmentId: number, data: ProcedureData) => {
    const success = await controller.createProcedure(appointmentId, data);
    if (success)
      alert("Datos guardados");
    else
      alert("Los datos no se pudieron guardadr")
  }

  const createAppointmentSupplies = async (appointmentId: number, supplies: AppointmentSupplies[]) => {
    const success = await controller.createAppointmentSupplies(appointmentId, supplies);
    if (success)
      alert("Datos guardados");
    else
      alert("Los datos no se pudieron guardadr")
  }

  const handleBudgetResponse = (approved: boolean) => {
    setWaitingBudget(false);
    if (approved) {
      setWorkflowState(4); // pasa a En Proceso
      alert("¡Presupuesto aprobado por el cliente! Puedes continuar con el trabajo.");
    } else {
      setBudgetRejected(true);
      alert("Presupuesto rechazado por el cliente. La OT no puede continuar.");
    }
  };

  // ---- Fotos ----
  const openPhotoModal = (stageKey: string) => {
    setPhotoStage(stageKey);
    setPhotoDialogOpen(true);
  };

  const onChoosePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const added = Array.from(files).map((f) => ({ name: f.name }));
    setPhotos((prev) => [...prev, ...added]);
    alert(`${files.length} foto(s) seleccionada(s): ${Array.from(files)
      .map((f) => f.name)
      .join(", ")}\nEtapa: ${photoStage}`);
  };

  const savePhotos = () => {
    alert(
      `Fotografías guardadas correctamente.\nEtapa: ${photoStage}\nLas fotos han sido asociadas al historial del vehículo.`
    );
    setPhotoDialogOpen(false);
  };

  // ---- Servicio ----
  const saveService = () => {
    if ((workflowState !== 5 && workflowState !== 6) || budgetRejected) {
      alert(
        'Solo puedes registrar servicios cuando el estado sea "Listo" o "Entregado" y el presupuesto haya sido aprobado.'
      );
      return;
    }
    alert("Información del servicio registrada correctamente.");
    setServiceDialogOpen(false);
  };

  const startService = (id: string) => {
    if (confirm("¿Deseas iniciar este servicio?")) {
      alert(`Servicio ${id} iniciado correctamente.`);
    }
  };

  const logout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      alert("Cerrando sesión...");
    }
    localStorage.removeItem('profile');
    router.replace('/');
  };

  return {
    appointments,
    supplies,
    selectedAppointment, setSelectedAppointment,
    procedureData, setProcedureData,
    workflowState, setWorkflowState,
    waitingBudget, setWaitingBudget,
    budgetRejected, setBudgetRejected,
    serviceDialogOpen, setServiceDialogOpen,
    photoDialogOpen, setPhotoDialogOpen,
    photoStage, setPhotoStage,
    photos, setPhotos,
    fileInputRef,
    createProcedures,
    createAppointmentSupplies,
    advanceWorkflowState,
    handleBudgetResponse,
    openPhotoModal,
    onChoosePhotos,
    savePhotos,
    saveService,
    startService,
    logout
  };

}
