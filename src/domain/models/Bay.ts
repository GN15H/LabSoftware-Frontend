// export interface 

interface IBay {
  id: number;
  name: string;
}

export class Bay {
  id: number;
  name: string;

  constructor({ id, name }: IBay) {
    this.id = id;
    this.name = name;
  }
}
