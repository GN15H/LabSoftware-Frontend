import axios from "axios";
import { validUsers } from "./LoginPage.mockData";
import { LoginPageData, LoginPageErrors } from "./LoginPage.types";

export class LoginPageController {
  private validator = new LoginPageValidator();

  async submitData(data: LoginPageData): Promise<boolean> {
    const errors = this.validator.validateAll(data);
    const hasErrors = Object.values(errors).some(err => err != null);

    if (hasErrors)
      throw errors;

    //submit data call
    const created: boolean = await this.login(data);
    return created;
  }

  private async login(data: LoginPageData): Promise<boolean> {
    try {
      const response = await axios.post('http://127.0.0.1:3000/auth/login', {
        email: data.email,
        password: data.password
      })
      console.log(response);
      return response.status != 201;
    } catch (e) {
      console.log(e);
      return false;
    }
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
