export interface IServiceMap {
  id: number;
  name: string;
}

interface IService {
  id: number;
  name: string;
}

export class Service {
  id: number;
  name: string;

  constructor({ id, name }: IService) {
    this.id = id;
    this.name = name;
  }

  static fromMap({ id, name }: IServiceMap): Service {
    return new Service({
      id: id,
      name: name
    })
  }
}
