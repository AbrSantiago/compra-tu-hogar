import { useState, useEffect, useCallback } from 'react';
import { listingService } from '../services/listingService';
import { clientService } from '../services/clientService';
import type { ReviewResponse } from '@/types/review';
import type { PropertyType } from '@/types/property';

export interface EnrichedListing {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  type: PropertyType;
  realEstateName: string;
  characteristics: string | null;
  averageRating: number | null;
  reviews: ReviewResponse[];
}

export const useHome = () => {
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [userRole] = useState<string | null>(() => localStorage.getItem('type'));
  const [userFavIds, setUserFavIds] = useState<number[]>([]);

  const isValidPropertyType = (t: string | undefined): t is PropertyType => {
    return t === 'house' || t === 'apartment';
  };

  const fetchHomeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const listingsData = await listingService.getAll().catch(() => []);

      const enriched: EnrichedListing[] = listingsData
        .filter((list) => list.status === 'active')
        .map((list) => {
          const prop = list.property;
          const inmo = list.real_estate;
          const propType = isValidPropertyType(prop?.type) ? prop.type : 'house';

          return {
            id: list.id,
            title: prop?.address || 'Dirección no especificada',
            location: prop?.location || 'Localidad no especificada',
            price: list.price,
            image: propType === 'house'
              ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            type: propType,
            realEstateName: inmo?.name || 'Inmobiliaria',
            characteristics: prop?.characteristics || null,
            averageRating: list.average_rating ?? null,
            reviews: list.reviews ?? [],
          };
        });

      setListings(enriched);
    } catch {
      setError('No se pudieron cargar las publicaciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    const loadUserFavorites = async () => {
      const clientId = Number(localStorage.getItem('userId'));
      if (isLoggedIn && userRole === 'client' && clientId) {
        try {
          const favs = await clientService.getFavorites(clientId);
          setUserFavIds(favs.map((f) => f.id));
        } catch (err) {
          console.error("Error cargando favoritos:", err);
        }
      }
    };
    loadUserFavorites();
  }, [isLoggedIn, userRole]);

  const handlePurchaseConfirm = async (listingId: number) => {
    await listingService.purchase(listingId);
    await fetchHomeData();
  };

  return {
    listings,
    isLoading,
    error,
    isLoggedIn,
    userRole,
    userFavIds,
    handlePurchaseConfirm,
    refetch: fetchHomeData
  };
};