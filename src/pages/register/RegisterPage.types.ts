
export type Severidad = 'success' | 'info' | 'warning' | 'error';
export type RegisterFields = 'firstName' | 'lastName' | 'documentType' | 'documentNumber' | 'birthDate' |
  'email' | 'phone' | 'address' | 'password' | 'confirmPassword' | 'termsAccepted' | 'marketingEmails';

export type RegisterPageData = {
  firstName: string,
  lastName: string,
  documentType: string,
  documentNumber: string,
  birthDate: string,
  email: string,
  phone: string,
  address: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean,
  marketingEmails: boolean,
}

export type RegisterPageErrors = {
  firstName: string | null,
  lastName: string | null,
  documentType: string | null,
  documentNumber: string | null,
  birthDate: string | null,
  email: string | null,
  phone: string | null,
  // address: string | null,
  password: string | null,
  confirmPassword: string | null,
  termsAccepted: string | null,
  // marketingEmails: string | null,
}
