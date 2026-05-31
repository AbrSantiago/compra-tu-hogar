import React, { useState } from 'react';
import { useAdminRealEstate } from '@/hooks/useAdminRealEstate';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';

export const AdminRealEstatePage = () => {
  const { realEstates, isLoading, error, createRealEstate } = useAdminRealEstate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!name || !email || !password) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await createRealEstate({ name, email, password });
      setFormSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Gestión de Inmobiliarias</h2>
        <p className="text-sm text-slate-500 mt-1">Administrá las cuentas de las inmobiliarias asociadas.</p>
      </div>

      <ErrorMessage message={error} />

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse w-full" />
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">Registrar una Inmobiliaria</h3>
              <p className="text-sm text-slate-500 mt-1">Da de alta una nueva inmobiliaria.</p>
            </div>

            <ErrorMessage message={formError} />
            
            {formSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center justify-center text-center font-medium">
                ¡Inmobiliaria creada con éxito!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                type="text"
                name="name"
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
                isLoading={false} 
                text="Guardar"
                loadingText="Registrando..."
              />
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {realEstates.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-medium bg-slate-50/50">
                        No hay inmobiliarias registradas aún.
                      </td>
                    </tr>
                  ) : (
                    realEstates.map((re) => (
                      <tr key={re.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{re.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{re.name}</td>
                        <td className="px-6 py-4 text-slate-600">{re.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};