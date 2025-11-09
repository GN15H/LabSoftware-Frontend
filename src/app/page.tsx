import LoginMUI from '@/app/components/LoginMUI';
import { LoginPage } from '@/pages/login/LoginPage';
import dotenv from 'dotenv';

dotenv.config();

export default function Page() {
  // return <LoginMUI />;
  return <LoginPage />;
}
