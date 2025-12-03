
export type ProcedureData = {
  description: string;
  supplies: AppointmentSupplies[];
}

export type AppointmentSupplies = {
  supply: number,
  amount: number,
}
