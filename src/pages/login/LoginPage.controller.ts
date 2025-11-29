import axios from "axios";
import { validUsers } from "./LoginPage.mockData";
import { LoginPageData, LoginPageErrors } from "./LoginPage.types";

export class LoginPageController {
  private validator = new LoginPageValidator();

  errorString(errors: LoginPageErrors): string {
    return this.validator.errorAsString(errors);
  }

  checkData(data: LoginPageData): LoginPageErrors | null {
    const errors = this.validator.validateAll(data);
    const hasErrors = Object.values(errors).some(err => err != null);

    if (hasErrors)
      return errors;
    return null;
  }

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
      console.log(process.env.NEXT_PUBLIC_BACKEND_URI + 'auth/login');
      const login = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + 'auth/login', {
        email: data.email,
        password: data.password
      })
      console.log(login);
      if (login.status != 200) return false;
      console.log("huh");
      const token = login.data['access_token'];
      console.log(login.data['access_token']);
      const profileRequest = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + 'auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      localStorage.setItem('profile', JSON.stringify({ id: profileRequest.data['sub'], userType: profileRequest.data['user_type'], token: token }))
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

class LoginPageValidator {

  readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private validateEmail(value: string): string | null {
    if (value.length == 0) return 'el correo electrónico es obligatorio';
    if (!this.emailRegex.test(value)) return 'el correo electrónico no es válido';
    return null;
  }

  private validatePassword(value: string): string | null {
    if (value.length == 0) return 'la contraseña es obligatoria';
    return null;
  }

  validateAll(data: LoginPageData): LoginPageErrors {
    return {
      email: this.validateEmail(data.email),
      password: this.validatePassword(data.password)
    };
  }

  errorAsString(errors: LoginPageErrors): string {
    let str = ''
    if (errors.email != null) {
      str += errors.email + ', ';
    }
    if (errors.password != null) str += errors.password;
    if (str[str.length - 1] == ',') str = str.substring(0, str.length - 2);
    return str;
  }
}
