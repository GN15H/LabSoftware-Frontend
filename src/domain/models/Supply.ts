import { SupplyType } from "./types";

interface ISupply {
  id: number;
  name: string;
  supplierId: number;
  supplyType: SupplyType;
}

export class Supply {
  id: number;
  name: string;
  supplierId: number;
  supplyType: SupplyType;

  constructor({ id, name, supplierId, supplyType }: ISupply) {
    this.id = id;
    this.name = name;
    this.supplierId = supplierId;
    this.supplyType = supplyType;
  }
}
