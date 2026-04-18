import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import './i18n/config';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}