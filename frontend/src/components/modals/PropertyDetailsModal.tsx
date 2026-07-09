import React, { useState } from 'react';
import type { PropertyDetails } from '@/types/property';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyDetails;
  userRole?: string | null;
  onReviewSubmit?: (listingId: number, rating: number, comment: string) => Promise<void>;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  property,
  userRole,
  onReviewSubmit
}) => {
  const [rating, setRating] = useState<number>(10);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const currentClientId = Number(localStorage.getItem('userId'));
  const hasReviewed = property.reviews.some(review => review.client_id === currentClientId);

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!onReviewSubmit) return;

    setIsSubmitting(true);
    try {
      await onReviewSubmit(property.id, rating, comment);
      setComment('');
      setStatusMessage({ type: 'success', text: 'Reseña publicada con éxito.' });
    } catch (error: unknown) {
      console.error("Error enviando reseña:", error);
      const axiosError = error as { response?: { data?: { detail?: string } } };
      const errorMsg = axiosError.response?.data?.detail || "Hubo un error al enviar tu reseña.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-64 w-full shrink-0">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">✕</button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {statusMessage && (
            <div className={`p-4 rounded-xl border font-semibold text-sm flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
              }`}>
              {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
            </div>
          )}

          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-slate-900">{property.title}</h2>
              <span className="text-xl font-bold text-blue-700">USD {property.price.toLocaleString('es-AR')}</span>
            </div>
            <p className="text-slate-500 mt-1">{property.location} • {property.type === 'house' ? 'Casa' : 'Departamento'}</p>
            <p className="text-sm font-semibold mt-2 text-slate-700">Vendido por: {property.realEstateName}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              Reseñas
              {property.averageRating != null && (
                <span className="text-sm font-normal text-amber-400 bg-amber-100 px-2 py-0.5 rounded-full">
                  ★ {property.averageRating.toFixed(1)} / 10.0
                </span>
              )}
            </h3>

            {userRole === 'client' && (
              !hasReviewed ? (
                <form onSubmit={handleSubmitReview} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm">Dejá tu opinión</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Puntaje (0 a 10)</label>
                      <input type="number" min="0" max="10" value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full md:w-1/3 px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Comentario</label>
                      <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                      {isSubmitting ? 'Enviando' : 'Publicar'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50/80 p-3.5 mb-5 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-800">
                  Ya registramos tu reseña.
                </div>
              )
            )}

            <div className="space-y-4 mb-6">
              {property.reviews.length === 0 ? (
                <p className="m-4 text-sm text-slate-500">Aún no hay reseñas para esta propiedad.</p>
              ) : (
                property.reviews.map(review => {
                  const isMyReview = review.client_id === currentClientId;
                  return (
                    <div
                      key={review.id}
                      className={`p-3 rounded-xl border transition-all ${isMyReview ? 'bg-slate-50/60 border-slate-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {isMyReview ? 'Tu reseña' : review.client_name || 'Usuario Anónimo'}
                        </span>
                        <span className="text-xs font-bold text-amber-500">
                          ★ {review.rating}/10
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 italic">{review.comment}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};