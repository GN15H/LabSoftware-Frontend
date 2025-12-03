
export type ProcedureData = {
  description: string;
  supplies: AppointmentSupplies[];
}

export type AppointmentSupplies = {
  supply: number,
  amount: number,
}

export type EvidenceData = {
  file: File | null
}
