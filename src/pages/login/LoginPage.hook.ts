import { useEffect, useState } from "react";
import { LoginPageData, LoginPageErrors } from "./LoginPage.types";
import { useRouter } from "next/navigation";
import { LoginPageController } from "./LoginPage.controller";


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
    try {
      setLoading(true);
      await controller.submitData(loginData); //este login deberia devolver al usuario
      // setSnack({ open: true, severity: 'success', message: `¡Bienvenido $.name}!` });
      // if (userData.type === 'admin') router.push('/admin');
      // else if (userData.type === 'mecanico') router.push('/mecanico');
      // else router.push('/cliente');
      router.push('/cliente');
    } catch (e) {
      console.log(e);
      // setErrors(e);
      setSnack({ open: true, severity: 'error', message: 'Por favor corrige los errores en el formulario' });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Realtime validation behavior similar al original: blurs y input corrigen errores
  //   if (errors.email && email) validateField('email', email);
  //   if (errors.password && password) validateField('password', password);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [email, password]);
  //

  return {
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
