import { validUsers } from "./LoginPage.mockData";
import { LoginPageData, LoginPageErrors } from "./LoginPage.types";

export class LoginPageController {
  private validator = new LoginPageValidator();

  async submitData(data: LoginPageData) {
    const errors = this.validator.validateAll(data);
    const hasErrors = Object.values(errors).some(err => err != null);

    if (hasErrors)
      throw errors;

    //submit data call
    const valid: boolean = await this.__mockLogin(data);
  }

  private async __mockLogin(data: LoginPageData): Promise<boolean> {
    setTimeout(() => { }, 1200);
    const userData = validUsers[data.email.trim().toLowerCase()];
    if (userData && data.password === '12345678') return true;
    return false;
  }
}

class LoginPageValidator {

  readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private validateEmail(value: string): string | null {
    if (!value) return 'El correo electrónico es obligatorio';
    if (!this.emailRegex.test(value)) return 'El correo electrónico es obligatorio';
    return null;
  }

  private validatePassword(value: string): string | null {
    if (!value) return 'La contraseña es obligatoria';
    return null;
  }

  validateAll(data: LoginPageData): LoginPageErrors {
    return {
      email: this.validateEmail(data.email),
      password: this.validatePassword(data.password)
    };
  }
}
