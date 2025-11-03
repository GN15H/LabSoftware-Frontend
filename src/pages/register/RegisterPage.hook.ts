import { useEffect, useState } from "react";
import { RegisterFields, RegisterPageData, RegisterPageErrors, Severidad } from "./RegisterPage.types";
import { useRouter } from "next/navigation";
import { RegisterPageController } from "./RegisterPage.controller";


export function useRegisterPage() {

  const controller = new RegisterPageController();
  const router = useRouter();

  const [snack, setSnack] = useState<{ open: boolean; severity: Severidad; message: string }>({
    open: false, severity: 'info', message: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0); // 0 activo, luego 1, luego 2 (completado)

  // const phoneDigits = (v: string) => v.replace(/\D/g, '');

  const [data, setData] = useState<RegisterPageData>({
    firstName: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingEmails: false,
  });

  const [errors, setErrors] = useState<RegisterPageErrors>({
    firstName: null,
    lastName: null,
    documentType: null,
    documentNumber: null,
    birthDate: null,
    email: null,
    phone: null,
    password: null,
    confirmPassword: null,
    termsAccepted: null,
  });

  useEffect(() => {
    try {
      console.log("mmm???");
      controller.checkData(data);
    } catch (e) {
      console.log(e);
      setErrors(e as RegisterPageErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.firstName, data.lastName, data.documentType, data.documentNumber, data.email, data.phone, data.password, data.confirmPassword]);

  const goToLogin = () => router.push('/');

  const showMessage = (m: string, sev: Severidad = 'error') => {
    setSnack({ open: true, severity: sev, message: m });
  }

  const showTerms = () => alert('Aquí se mostrarían los términos y condiciones completos');
  const showPrivacy = () => alert('Aquí se mostraría la política de privacidad completa');

  const handleFieldChange = (field: RegisterFields, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      controller.checkData(data);

    } catch (e) {
      setErrors(e as RegisterPageErrors);
      showMessage('Por favor corrige los errores señalados en el formulario', 'error');
    } finally {
      setLoading(false);
    }
    setStage(2);

  }

  return {
    snack, setSnack,
    loading, setLoading,
    stage,
    data,
    errors,
    goToLogin,
    showMessage,
    handleFieldChange,
    handleSubmit,
    showTerms,
    showPrivacy
  };

}
