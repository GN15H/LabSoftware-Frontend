interface IPayment {
  id: number;
  price: number;
  appointmentId: number;
}

export class Payment {
  id: number;
  price: number;
  appointmentId: number;

  constructor({ id, price, appointmentId }: IPayment) {
    this.id = id;
    this.price = price;
    this.appointmentId = appointmentId;
  }
}
