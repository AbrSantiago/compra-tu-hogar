import { useState, useEffect, useCallback } from 'react';
import { listingService } from '../services/listingService';
import { clientService } from '../services/clientService';
import type { ReviewResponse } from '@/types/review';
import type { PropertyType } from '@/types/property';
import { getPropertyImage } from '@/utils/imageMapper';
import type { ListingFilters } from '@/types';

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
  const [isLoggedIn] = useState<boolean>(() => typeof window !== 'undefined' && !!localStorage.getItem('token'));
  const [userRole] = useState<string | null>(() => typeof window !== 'undefined' ? localStorage.getItem('type') : null);
  const [userFavIds, setUserFavIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});

  const isValidPropertyType = (t: string | undefined): t is PropertyType => {
    return t === 'house' || t === 'apartment';
  };

  const fetchHomeData = useCallback(async (currentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const listingsData = await listingService.getAll(currentFilters).catch(() => []);

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
            image: getPropertyImage(list.id),
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

  const refreshFavorites = useCallback(async () => {
    const clientId = Number(localStorage.getItem('userId'));
    if (isLoggedIn && userRole === 'client' && clientId) {
      const favs = await clientService.getFavorites(clientId);
      setUserFavIds(favs.map((f) => f.id));
    }
  }, [isLoggedIn, userRole]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchHomeData(), refreshFavorites()]);
    };
    init();
  }, [fetchHomeData, refreshFavorites]);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchHomeData();
    };
    loadInitialData();
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

  const applyFilters = async (newFilters: ListingFilters) => {
      setFilters(newFilters);
      await fetchHomeData(newFilters);
  };

  return {
    listings,
    isLoading,
    error,
    isLoggedIn,
    userRole,
    userFavIds,
    handlePurchaseConfirm,
    refetch: fetchHomeData,
    refreshFavorites,
    applyFilters
  };
};