import { useState, useEffect } from 'react';
import { listingService } from '../services/listingService';
import { propertyService } from '../services/propertyService';
import { realEstateService } from '../services/realEstateService';

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const fetchHomeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listingsData, propertiesData, realEstatesData] = await Promise.all([
        listingService.getAll(),
        propertyService.getAll(),
        realEstateService.getAll() 
      ]);

      const enriched: EnrichedListing[] = listingsData
        .filter(list => list.status === 'active') 
        .map((list) => {
          const matchedProp = propertiesData.find(p => p.id === list.property_id);
          const matchedInmo = realEstatesData.find(re => re.id === (matchedProp as any)?.real_estate_id);

          return {
            id: list.id,
            title: matchedProp?.address || 'Dirección no especificada',
            location: matchedProp?.location || 'Localidad no especificada', 
            price: list.price,
            image: matchedProp?.type === 'house'
              ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            type: matchedProp?.type || 'house',
            realEstateName: matchedInmo?.name || 'Inmobiliaria Independiente', 
            characteristics: matchedProp?.characteristics || null
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
    userRole,
    handleLogout, 
    refetch: fetchHomeData 
  };
};