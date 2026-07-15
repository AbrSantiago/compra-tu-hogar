import { useAdminRealEstate } from '@/hooks/useAdminRealEstate';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable, SuccessMessage } from '@/components/admin';
import { EditModal } from '@/components/modals/EditModal';
import { DeleteModal } from '@/components/modals/DeleteModal';

export const AdminRealEstatePage = () => {
  const { 
    realEstates, 
    isLoading, 
    error, 
    handleSubmit, 
    formError, 
    formSuccess, 
    name, 
    setName, 
    email, 
    setEmail, 
    password, 
    setPassword,
    isEditModalOpen,
    isDeleteModalOpen,
    isActionSubmitting,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    onConfirmEdit,
    onConfirmDelete
  } = useAdminRealEstate();
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Inmobiliarias" 
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
            <SubmitButton isLoading={isLoading} text="Guardar" loadingText="Registrando" />
          </form>
        </div>

        <div className="lg:col-span-2">
          <AdminTable
            isLoading={isLoading}
            data={realEstates}
            headers={['ID', 'Nombre', 'Email', 'Acciones']}
            emptyMessage="No hay inmobiliarias registradas aún."
            renderRow={(re) => (
              <tr key={re.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{re.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{re.name}</td>
                <td className="px-6 py-4 text-slate-600">{re.email}</td>
                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openEditModal(re)}
                    title="Editar"
                    className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-xs"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(re)}
                    title="Eliminar"
                    className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all shadow-xs"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Inmobiliaria"
        subtitle="Actualizá los datos de la inmobiliaria"
        onSubmit={onConfirmEdit}
        isSubmitting={isActionSubmitting}
      >
        <FloatingInput
          type="text"
          name="name"
          label="Nombre"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          required
        />
        <FloatingInput
          type="email"
          name="email"
          label="Email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          required
        />
      </EditModal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="¿Eliminar inmobiliaria?"
        description="¿Seguro que querés eliminar esta inmobiliaria? Sus publicaciones y el acceso a la plataforma se perderán."
        onConfirm={onConfirmDelete}
        isSubmitting={isActionSubmitting}
      />
    </div>
  );
};