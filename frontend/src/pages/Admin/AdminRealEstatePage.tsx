import { useAdminRealEstate } from '@/hooks/useAdminRealEstate';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable, SuccessMessage } from '@/components/admin';

export const AdminRealEstatePage = () => {
  const { realEstates, isLoading, error, handleSubmit, formError, formSuccess, name, setName, email, setEmail, password, setPassword } = useAdminRealEstate();
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Gestión de Inmobiliarias" 
        description="Administrá las cuentas de las inmobiliarias asociadas." 
      />

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Registrar una Inmobiliaria</h3>
            <p className="text-sm text-slate-500 mt-1">Da de alta una nueva inmobiliaria.</p>
          </div>

          <ErrorMessage message={formError} />
          {formSuccess && <SuccessMessage message="¡Inmobiliaria creada con éxito!" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput type="text" name="name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <FloatingInput type="email" name="email" label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FloatingInput type="password" name="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <SubmitButton isLoading={false} text="Guardar" loadingText="Registrando" />
          </form>
        </div>

        <div className="lg:col-span-2">
          <AdminTable
            isLoading={isLoading}
            data={realEstates}
            headers={['ID', 'Nombre', 'Email']}
            emptyMessage="No hay inmobiliarias registradas aún."
            renderRow={(re) => (
              <tr key={re.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{re.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{re.name}</td>
                <td className="px-6 py-4 text-slate-600">{re.email}</td>
              </tr>
            )}
          />
        </div>

      </div>
    </div>
  );
};