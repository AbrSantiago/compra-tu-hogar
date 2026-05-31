import React from 'react';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { Link } from 'react-router-dom';

export const Register: React.FC = () => {
  const { formData, errorMsg, isSubmitting, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Te damos la bienvenida a <br /> <span className="text-blue-600">Compra Tu Hogar</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Crea una cuenta para empezar a buscar.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center justify-center text-center">
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="relative border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full px-4 pt-6 pb-2 text-sm bg-transparent border-0 text-slate-900 focus:outline-none focus:ring-0"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-4 text-sm text-slate-400 font-medium origin-[0] -translate-y-3 scale-75 transform transition-all duration-150 cursor-text
                           peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                           peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
              >
                Nombre
              </label>
            </div>

            <div className="relative border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
              <input
                type="text"
                name="surname"
                id="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full px-4 pt-6 pb-2 text-sm bg-transparent border-0 text-slate-900 focus:outline-none focus:ring-0"
                required
              />
              <label
                htmlFor="surname"
                className="absolute left-4 top-4 text-sm text-slate-400 font-medium origin-[0] -translate-y-3 scale-75 transform transition-all duration-150 cursor-text
                           peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                           peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
              >
                Apellido
              </label>
            </div>
          </div>

          <div className="relative border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full px-4 pt-6 pb-2 text-sm bg-transparent border-0 text-slate-900 focus:outline-none focus:ring-0"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-4 text-sm text-slate-400 font-medium origin-[0] -translate-y-3 scale-75 transform transition-all duration-150 cursor-text
                         peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                         peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              Correo electrónico
            </label>
          </div>

          <div className="relative border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full px-4 pt-6 pb-2 text-sm bg-transparent border-0 text-slate-900 focus:outline-none focus:ring-0"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-4 text-sm text-slate-400 font-medium origin-[0] -translate-y-3 scale-75 transform transition-all duration-150 cursor-text
                         peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                         peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              Contraseña
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] cursor-pointer shadow-xs'
              }`}
            >
              {isSubmitting ? 'Registrando cuenta...' : 'Registrarme'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </div>

      </div>
    </div>
  );
};