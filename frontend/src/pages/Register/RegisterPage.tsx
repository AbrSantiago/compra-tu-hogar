import React from 'react';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { FloatingInput } from '../../components/form/FloatingInput';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { BackButton } from '../../components/ui/BackButton';
import { FormHeader } from '../../components/form/FormHeader';
import { FormFooter } from '../../components/form/FormFooter';
import { SubmitButton } from '../../components/form/SubmitButton.tsx';

export const Register: React.FC = () => {
  const { formData, errorMsg, isSubmitting, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

        <BackButton />

        <FormHeader
          title={<>Te damos la bienvenida a <br /> <span className="text-blue-600">Compra Tu Hogar</span></>}
          description="Crea una cuenta para empezar a buscar."
        />

        <ErrorMessage message={errorMsg} />

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              type="text"
              name="name"
              label="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FloatingInput
              type="text"
              name="surname"
              label="Apellido"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <FloatingInput
            type="email"
            name="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FloatingInput
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <SubmitButton
            isLoading={isSubmitting}
            text="Registrarme"
            loadingText="Registrando cuenta..."
          />
        </form>

        <FormFooter
          question="¿Ya tenés una cuenta?"
          linkText="Iniciá sesión"
          to="/login"
        />
      </div>
    </div>
  );
};