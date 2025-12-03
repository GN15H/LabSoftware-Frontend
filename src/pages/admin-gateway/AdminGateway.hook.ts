import { Supply } from "@/domain/models/Supply";
import { useEffect, useState } from "react";
import { AdminGatewayController } from "./AdminGateway.controller";
import { useRouter } from "next/navigation";
import { Supplier } from "@/domain/models/Supplier";
import { Vehicle } from "@/domain/models/Vehicle";
import { Appointment } from "@/domain/models/Appointment";
import { User } from "@/domain/models/User";
import { Service } from "@/domain/models/Service";
import { SupplierData, SupplyData, UserData } from "./AdminGateway.types";
import { AppointmentData } from "../client-gateway/ClientGateway.types";


export function useAdminGateway() {

  const router = useRouter();
  const controller = new AdminGatewayController();
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const createService = async (name: string, price: bigint) => {
    const createdService: Service | null = await controller.createService(name, price);
    if (createdService != null) {
      setServices(prev => [...prev, createdService]);
    }
  }

  const updateService = async (id: number, name: string, price: bigint) => {
    const createdService: Service | null = await controller.updateService(id, name, price);
    if (createdService != null) {
      setServices(prev => {
        const toBeUpdatedService = prev.find(s => s.id == id);
        if (toBeUpdatedService == undefined) return prev;
        let newArr = [...prev];
        const toBeUpdatedServiceIndex = newArr.indexOf(toBeUpdatedService);
        newArr[toBeUpdatedServiceIndex] = createdService;
        return newArr;
      });
    }
  }

  const removeService = async (id: number) => {
    const deleted: boolean = await controller.removeService(id);
    if (deleted) {
      setServices(prev => {
        const toBeDeletedService = prev.find(s => s.id == id);
        if (toBeDeletedService == undefined) return prev;
        let newArr = [...prev];
        const toBeDeletedServiceIndex = newArr.indexOf(toBeDeletedService);
        newArr.splice(toBeDeletedServiceIndex, 1);
        return newArr;
      });
    }
  }

  const createSupply = async (data: SupplyData) => {
    const createdSupply: Supply | null = await controller.createSupply(data);
    if (createdSupply != null) {
      setSupplies(prev => [...prev, createdSupply]);
    }
  }

  const updateSupply = async (id: number, data: SupplyData) => {
    console.log('huh');
    const updatedSupply: Supply | null = await controller.updateSupply(id, data);
    console.log('huhmas');
    if (updatedSupply != null) {
      setSupplies(prev => {
        const toBeUpdatedSupply = prev.find(s => s.id == id);
        if (toBeUpdatedSupply == undefined) return prev;
        let newArr = [...prev];
        const toBeUpdatedSupplyIndex = newArr.indexOf(toBeUpdatedSupply);
        newArr[toBeUpdatedSupplyIndex] = updatedSupply;
        return newArr;
      });
    }
  }

  const removeSupply = async (id: number) => {
    const deleted: boolean = await controller.removeSupply(id);
    if (deleted) {
      setSupplies(toBeDeletedSupply => {
        const toBeDeletedService = toBeDeletedSupply.find(s => s.id == id);
        if (toBeDeletedService == undefined) return toBeDeletedSupply;
        let newArr = [...toBeDeletedSupply];
        const toBeDeletedSupplyIndex = newArr.indexOf(toBeDeletedService);
        newArr.splice(toBeDeletedSupplyIndex, 1);
        return newArr;
      });
    }
  }

  const createSupplier = async (data: SupplierData) => {
    const createdSupplier: Supplier | null = await controller.createSupplier(data);
    if (createdSupplier != null) {
      setSuppliers(prev => [...prev, createdSupplier]);
    }
  }

  const updateSupplier = async (id: number, data: SupplierData) => {
    const updatedSupplier: Supplier | null = await controller.updateSupplier(id, data);
    if (updatedSupplier != null) {
      setSuppliers(prev => {
        const toBeUpdatedSupplier = prev.find(s => s.id == id);
        if (toBeUpdatedSupplier == undefined) return prev;
        let newArr = [...prev];
        const toBeUpdatedSupplierIndex = newArr.indexOf(toBeUpdatedSupplier);
        newArr[toBeUpdatedSupplierIndex] = updatedSupplier;
        return newArr;
      });
    }
  }

  const removeSupplier = async (id: number) => {
    const deleted: boolean = await controller.removeSupplier(id);
    if (deleted) {
      setSuppliers(toBeDeletedSupply => {
        const toBeDeletedSupplier = toBeDeletedSupply.find(s => s.id == id);
        if (toBeDeletedSupplier == undefined) return toBeDeletedSupply;
        let newArr = [...toBeDeletedSupply];
        const toBeDeletedSupplierIndex = newArr.indexOf(toBeDeletedSupplier);
        newArr.splice(toBeDeletedSupplierIndex, 1);
        return newArr;
      });
    }
  }

  const createAppointment = async (data: AppointmentData) => {
    const createdAppointment: Appointment | null = await controller.createAppointment(data);
    if (createdAppointment != null) {
      window.location.reload();
    }
  }

  const updateAppointment = async (id: number, date: string, hour: string) => {
    const updated: boolean = await controller.reassignAppointment(id, date, hour);
    if (updated) {
      setAppointments(prev => {
        const toBeUpdatedAppointment = prev.find(s => s.id == id);
        if (toBeUpdatedAppointment == undefined) return prev;
        let newArr = [...prev];
        const toBeUpdatedAppointmentIndex = newArr.indexOf(toBeUpdatedAppointment);
        newArr[toBeUpdatedAppointmentIndex].date = new Date(date + "T" + hour + ":00.000Z")
        return newArr;
      });
    }
  }

  const cancelAppointment = async (id: number) => {
    const cancelled: boolean = await controller.cancelAppointment(id);
    if (cancelled) {
      setAppointments(prev => {
        const toBeDeletedAppointment = prev.find(s => s.id == id);
        if (toBeDeletedAppointment == undefined) return prev;
        let newArr = [...prev];
        const toBeDeletedAppointmentIndex = newArr.indexOf(toBeDeletedAppointment);
        newArr.splice(toBeDeletedAppointmentIndex, 1);
        return newArr;
      });
    }
  }

  const createUser = async (data: UserData) => {
    const createdUser: User | null = await controller.createUser(data);
    if (createdUser != null) {
      setUsers(prev => [...prev, createdUser]);
    }
  }

  const removeUser = async (id: number) => {
    const deleted: boolean = await controller.removeUser(id);
    if (deleted) {
      setUsers(prev => {
        const toBeDeletedUser = prev.find(s => s.id == id);
        if (toBeDeletedUser == undefined) return prev;
        let newArr = [...prev];
        const toBeDeletedUserIndex = newArr.indexOf(toBeDeletedUser);
        newArr.splice(toBeDeletedUserIndex, 1);
        return newArr;
      });
    }
  }
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
      const data = await controller.fetchData();
      setSupplies(data.supplies);
      setSuppliers(data.suppliers);
      setServices(data.services);
      setUsers(data.users);
      setVehicles(data.vehicles);
      setAppointments(data.appointments);
    }
    fetchData();
  }, [])

  return {
    services, setServices,
    supplies, setSupplies,
    suppliers, setSuppliers,
    users, setUsers,
    vehicles, setVehicles,
    appointments, setAppointments,
    createService, updateService, removeService,
    createSupply, updateSupply, removeSupply,
    createSupplier, updateSupplier, removeSupplier,
    createAppointment, updateAppointment, cancelAppointment,
    createUser, removeUser
  }
}
