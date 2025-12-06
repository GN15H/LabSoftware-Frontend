import { useState } from "react";
import { LoginPageData, LoginPageErrors } from "@/types/LoginPage.types";
import { useRouter } from "next/navigation";
import { LoginPageController } from "@/controllers/LoginPage.controller";


export function useLoginPage() {
  const router = useRouter();
  const controller = new LoginPageController();

  const [loginData, setLoginData] = useState<LoginPageData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginPageErrors>({
    email: null,
    password: null
  })
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'info' | 'warning' | 'error'; message: string }>({ open: false, severity: 'info', message: '' });

  const handleChangeField = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRegister = () => {
    router.push('/registro');
  };

  const handleForgot = () => {
    alert('Función de recuperación de contraseña. Se enviaría un email para restablecer la contraseña.');
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const err = controller.checkData(loginData);
    if (err != null) {
      setErrors(err);
      setSnack({ open: true, severity: 'error', message: controller.errorString(err) });
      return;
    }
    setLoading(true);
    const loggedIn = await controller.submitData(loginData); //este login deberia devolver al usuario
    setLoading(false);
    if (!loggedIn) {
      setSnack({ open: true, severity: 'error', message: 'Credenciales incorrectas' });
      return;
    }
    const profile = JSON.parse(localStorage.getItem('profile') ?? '');
    console.log('ejem el perfil si se puede saber?', profile);
    if (profile['userType'] == 'admin')
      router.push('/admin');
    else if (profile['userType'] == 'mechanic')
      router.push('/mecanico');
    else if (profile['userType'] == 'user')
      router.push('/cliente');
  };

  return {
    errors,
    loginData,
    remember, setRemember,
    loading, setLoading,
    snack, setSnack,
    handleChangeField,
    handleRegister,
    handleForgot,
    handleSubmit
  };
}
