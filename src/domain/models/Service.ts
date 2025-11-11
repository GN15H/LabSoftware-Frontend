export interface IServiceMap {
  id: number;
  name: string;
  price: string;
}

interface IService {
  id: number;
  name: string;
  price: bigint;
}

export class Service {
  id: number;
  name: string;
  price: bigint;

  constructor({ id, name, price }: IService) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  static fromMap({ id, name, price }: IServiceMap): Service {
    return new Service({
      id: id,
      name: name,
      price: BigInt(price)
    })
  }
}
