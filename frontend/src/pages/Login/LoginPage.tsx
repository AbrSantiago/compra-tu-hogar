import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { FloatingInput, FormHeader, FormFooter, SubmitButton } from '@/components/form';
import { BackButton, ErrorMessage } from '@/components/ui';

export const Login: React.FC = () => {
  const { email, setEmail, password, setPassword, handleSubmit, isLoading, errorMsg } = useLoginForm();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

        <BackButton />

        <FormHeader
          title={<>Ingresar a <br /> <span className="text-blue-600">Compra Tu Hogar</span></>}
          description="Busca tu hogar ideal con nosotros."
        />

        <ErrorMessage message={errorMsg} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            type="email"
            name="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FloatingInput
            type="password"
            name="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <SubmitButton
            isLoading={isLoading}
            text="Iniciar Sesión"
            loadingText="Verificando..."
          />
        </form>

        <FormFooter
          question="¿No tenés una cuenta?"
          linkText="Registrarme"
          to="/register"
        />
      </div>
    </div>
  );
};