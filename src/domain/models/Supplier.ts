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

}
