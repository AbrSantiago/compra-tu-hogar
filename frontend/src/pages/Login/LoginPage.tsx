import React, { useState } from 'react';
import { useLoginForm } from '../../hooks/useLoginForm.tsx';
import { Link } from 'react-router-dom';
import { BackButton } from '../../components/BackButton.tsx';
import { FloatingInput } from '../../components/FloatingInput.tsx';
import { ErrorMessage } from '../../components/ErrorMessage.tsx'; 


export const Login: React.FC = () => {
  const { handleLogin, isLoading, errorMsg } = useLoginForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        <BackButton />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ingresar a <br/> <span className="text-blue-600">Compra Tu Hogar</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">Busca tu hogar ideal con nosotros.</p>
        </div>

        <ErrorMessage message={errorMsg} />

        <form onSubmit={onSubmit} className="space-y-4">
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all ${
                isLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
          ¿No tenés una cuenta? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Registrarme</Link>
        </div>
      </div>
    </div>
  );
};