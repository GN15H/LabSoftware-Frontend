export interface ISupplierMap {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface ISupplier {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export class Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;

  constructor({ id, name, phone, email }: ISupplier) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }

  static fromMap({ id, name, phone, email }: ISupplierMap): Supplier {
    return new Supplier({
      id: id,
      name: name,
      phone: phone,
      email: email
    })
  }

}
