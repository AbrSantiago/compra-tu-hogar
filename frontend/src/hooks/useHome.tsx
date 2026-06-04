import { useState, useEffect } from 'react';
import { listingService } from '../services/listingService';
import { propertyService } from '../services/propertyService';

export interface EnrichedListing {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  realEstateName: string;
  beds: number;
  baths: number;
}

export const useHome = () => {
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const fetchHomeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listingsData, propertiesData] = await Promise.all([
        listingService.getAll(),
        propertyService.getAll()
      ]);

      const enriched: EnrichedListing[] = listingsData
        .filter(list => list.status === 'active') 
        .map((list) => {
          const matchedProp = propertiesData.find(p => p.id === list.property_id);

          return {
            id: list.id,
            title: matchedProp?.characteristics || 'Sin descripción adicional disponible.',
            location: matchedProp?.location || matchedProp?.address || 'Ubicación no especificada',
            price: list.price,
            image: matchedProp?.type === 'house'
              ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            realEstateName: 'Firma Asociada',
            beds: matchedProp?.type === 'house' ? 3 : 2, 
            baths: matchedProp?.type === 'house' ? 2 : 1
          };
        });

      setListings(enriched);
    } catch (err: any) {
      setError('No se pudieron cargar las publicaciones del mercado inmobiliario.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return { 
    listings, 
    isLoading, 
    error, 
    isLoggedIn, 
    handleLogout, 
    refetch: fetchHomeData 
  };
};