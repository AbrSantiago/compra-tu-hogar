import { useState, useEffect, useCallback } from 'react';
import { listingService } from '../services/listingService';

export interface EnrichedListing {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  type: "house" | "apartment";
  realEstateName: string;
  characteristics: string | null;
}

export const useHome = () => {
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('type'));

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('type');
  localStorage.removeItem('userId');
  setIsLoggedIn(false);
  setUserRole(null);
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

          return {
            id: list.id,
            title: prop?.address || 'Dirección no especificada',
            location: prop?.location || 'Localidad no especificada',
            price: list.price,
            image: prop?.type === 'house'
              ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            type: prop?.type || 'house',
            realEstateName: inmo?.name || 'Inmobiliaria',
            characteristics: prop?.characteristics || null
          };
        });

      setListings(enriched);
    } catch {
      setError('No se pudieron cargar las publicaciones del mercado inmobiliario.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchHomeData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchHomeData]);

  return {
    listings,
    isLoading,
    error,
    isLoggedIn,
    userRole,
    handleLogout,
    refetch: fetchHomeData
  };
};