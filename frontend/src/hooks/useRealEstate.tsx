import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { listingService } from '../services/listingService';
import type { PropertyResponse, PropertyType } from '../types/property';
import type { ListingResponse, ListingStatus } from '../types/listing';

export const useRealEstate = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [propAddress, setPropAddress] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propType, setPropType] = useState<'house' | 'apartment'>('house');
  const [propCharacteristics, setPropCharacteristics] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchRealEstateData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [propertiesData, listingsData] = await Promise.all([
        propertyService.getAll(),
        listingService.getAll(), 
      ]);
      setProperties(propertiesData);
      setListings(listingsData);
    } catch (err: any) {
      setError('Error al cargar los datos del panel inmobiliario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!propAddress || !propLocation) {
      setFormError('La dirección y la ubicación son obligatorias.');
      return;
    }

    setIsSubmitting(true);
    try {
      await propertyService.create({
        property_id: "",
        address: propAddress,
        location: propLocation,
        type: propType as PropertyType,
        characteristics: propCharacteristics || null,
      });

      setFormSuccess('Propiedad física registrada correctamente.');
      setPropAddress('');
      setPropLocation('');
      setPropCharacteristics('');
      
      await fetchRealEstateData();
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      setFormError(backendMessage || 'Error al registrar la propiedad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!selectedPropertyId || !listingPrice) {
      setFormError('Debes seleccionar una propiedad y asignar un precio.');
      return;
    }

    setIsSubmitting(true);
    try {
      await listingService.create({
        property_id: selectedPropertyId,
        price: parseFloat(listingPrice),
        status: "active" as ListingStatus,
      });

      setFormSuccess('¡Propiedad publicada en el mercado de forma exitosa!');
      setSelectedPropertyId(null);
      setListingPrice('');
      
      await fetchRealEstateData();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setFormError('Esta propiedad ya cuenta con una publicación activa creada por tu inmobiliaria.');
      } else {
        const backendMessage = err.response?.data?.detail;
        setFormError(backendMessage || 'Error al crear la publicación.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRealEstateData();
  }, []);

  return {
    properties,
    listings,
    isLoading,
    error,
    refetch: fetchRealEstateData,
    propAddress, setPropAddress,
    propLocation, setPropLocation,
    propType, setPropType,
    propCharacteristics, setPropCharacteristics,
    handleCreatePropertySubmit,
    selectedPropertyId, setSelectedPropertyId,
    listingPrice, setListingPrice,
    handleCreateListingSubmit,
    isSubmitting,
    formError,
    formSuccess,
  };
};