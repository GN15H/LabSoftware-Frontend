export interface IPaymentMap {
  id: number;
  total: string;
  method: string;
  appointment_id: number;
}

interface IPayment {
  id: number;
  price: number;
  appointmentId: number;
  method: string;
}

export class Payment {
  id: number;
  price: number;
  appointmentId: number;
  method: string;

  constructor({ id, price, appointmentId, method }: IPayment) {
    this.id = id;
    this.price = price;
    this.appointmentId = appointmentId;
    this.method = method;
  }

  static fromMap({ id, total, method, appointment_id }: IPaymentMap): Payment {
    return new Payment({
      id: id,
      price: parseInt(total),
      method: method,
      appointmentId: appointment_id
    })
  }
}
