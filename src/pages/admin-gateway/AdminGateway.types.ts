
export type SupplyData = {
  name: string;
  stock: number;
  minStock: number;
  price: string;
  supplierId: number | undefined;
}

export type SupplierData = {
  name: string;
  phone: string;
  email: string;
}

export type UserData = {
  name: string;
  lastName: string;
  dni: string;
  email: string;
  userType: number;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export type AppointmentData = {
  vehicle: number | null,
  service: number | null,
  date: string,
  hour: string,
  description: string
}
