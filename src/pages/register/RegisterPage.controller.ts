import { RegisterPageData, RegisterPageErrors } from "./RegisterPage.types";


export class RegisterPageController {
  private validator = new RegisterPageValidator();

  checkData(data: RegisterPageData) {
    const errors = this.validator.validateAll(data);
    const hasErrors = Object.values(errors).some(err => err != null);

    if (hasErrors)
      throw errors;
  }

  async submitData(data: RegisterPageData) {
    const errors = this.validator.validateAll(data);
    const hasErrors = Object.values(errors).some(err => err != null);

    if (hasErrors)
      throw errors;

    //submit data call
    const valid: boolean = await this.__mockLogin(data);
  }

  private async __mockLogin(data: RegisterPageData): Promise<boolean> {
    return true;
    // setTimeout(() => { }, 1200);
    // const userData = validUsers[data.email.trim().toLowerCase()];
    // if (userData && data.password === '12345678') return true;
    // return false;
  }
}

class RegisterPageValidator {

  readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private validateFirstName(value: string): string | null {
    if (!value) return 'El nombre es obligatorio';
    return null;
  }

  private validateLastName(value: string): string | null {
    if (!value) return 'El apellido es obligatorio';
    return null;
  }

  private validateDocumentType(value: string): string | null {
    if (!value) return 'El tipo de documento es obligatorio';
    return null;
  }

  private validateDocument(value: string): string | null {
    if (!value) return 'El documento es obligatorio';
    if (!/^\d{6,12}$/.test(value)) return 'Debe contener entre 6 y 12 números';
    return null;
  }

  // private validateDate(value: string): string | null {
  //   if (!value) return 'El documento es obligatorio';
  //   return null;
  // }
  //

  private validateEmail(value: string): string | null {
    if (!value) return 'El correo electrónico es obligatorio';
    if (!this.emailRegex.test(value)) return 'El correo electrónico es obligatorio';
    return null;
  }

  private validatePhone(value: string): string | null {
    if (!value) return 'El numero de telefono es obligatorio';
    if (!/^\d{7,10}$/.test(value)) return 'Ingresa un número válido (7-10 dígitos)';
    return null;
  }

  private validatePassword(value: string): string | null {
    if (!value) return 'La contraseña es obligatoria';
    return null;
  }

  private validateConfirmPassword(password: string, confirm: string): string | null {
    if (password != confirm) return 'Las contrasenas son diferentes';
    return null;
  }

  private validateTermsAccepted(value: boolean): string | null {
    if (!value) return "Se deben aceptar los terminos y condiciones";
    return null;
  }

  validateAll(data: RegisterPageData): RegisterPageErrors {
    return {
      firstName: this.validateFirstName(data.firstName),
      lastName: this.validateLastName(data.lastName),
      documentType: this.validateDocumentType(data.documentType),
      documentNumber: this.validateDocument(data.documentNumber),
      birthDate: null,
      email: this.validateEmail(data.email),
      phone: this.validatePhone(data.phone),
      password: this.validatePassword(data.password),
      confirmPassword: this.validateConfirmPassword(data.password, data.confirmPassword),
      termsAccepted: this.validateTermsAccepted(data.termsAccepted),
    };
  }
}
