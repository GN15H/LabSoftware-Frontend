
export interface ISupplyMap {
  id: number;
  name: string;
  amount: number;
  supplier_id: number;
  supply_type_id: number;
  min_stock: number;
  price: number;
}

interface ISupply {
  id: number;
  name: string;
  amount: number;
  supplierId: number;
  supplyTypeId: number;
  minStock: number;
  price: number;
}

export class Supply {
  id: number;
  name: string;
  amount: number;
  supplierId: number;
  supplyTypeId: number;
  minStock: number;
  price: number;

  constructor({ id, amount, name, supplierId, supplyTypeId, minStock, price }: ISupply) {
    this.id = id;
    this.name = name;
    this.supplierId = supplierId;
    this.supplyTypeId = supplyTypeId;
    this.amount = amount;
    this.minStock = minStock;
    this.price = price;
  }

  static fromMap({ id, name, amount, supplier_id, supply_type_id, min_stock, price }: ISupplyMap): Supply {
    return new Supply({
      id: id,
      name: name,
      amount: amount,
      supplierId: supplier_id,
      supplyTypeId: supply_type_id,
      minStock: min_stock,
      price: price
    })
  }
}
