import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';
import { listingService } from '../services/listingService';
import { extractErrorMessage } from '@/utils/errors';
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

  const fetchRealEstateData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentRealEstateId = Number(localStorage.getItem('userId'));

      const [propertiesData, listingsData] = await Promise.all([
        propertyService.getAll(),
        listingService.getAll(),
      ]);

      const filteredListings = listingsData.filter((list: ListingResponse) => {
        const idInmo = list.real_estate?.id;
        return idInmo === currentRealEstateId;
      });

      const filteredProperties = propertiesData.filter((prop) => {
        const perteneceAMisListings = filteredListings.some(
          (list: ListingResponse) => list.property_id === prop.id
        );

        const esPropiedadNuevaSinPublicar = !listingsData.some(
          (list: ListingResponse) => list.property_id === prop.id
        );

        return perteneceAMisListings || esPropiedadNuevaSinPublicar;
      });

      setProperties(filteredProperties);
      setListings(filteredListings);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del panel inmobiliario.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    } catch (err: unknown) {
      setFormError(extractErrorMessage(err, 'Error al registrar la propiedad.'));
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
    } catch (err: unknown) {
      const errorTyped = err as { response?: { status?: number } };
      if (errorTyped.response?.status === 409) {
        setFormError('Esta propiedad ya cuenta con una publicación activa creada por tu inmobiliaria.');
      } else {
        setFormError(extractErrorMessage(err, 'Error al crear la publicación.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    try {
      await listingService.delete(listingId);
      setFormSuccess('Publicación eliminada con éxito');
      await fetchRealEstateData();
    } catch (err: unknown) {
      setFormError(extractErrorMessage(err, 'Error al eliminar la publicación.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateListing = async (listingId: number, updateData: { price?: number; status?: ListingStatus }) => {
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    try {
      await listingService.update(listingId, updateData);
      setFormSuccess('Publicación actualizada con éxito');
      await fetchRealEstateData();
    } catch (err: unknown) {
      setFormError(extractErrorMessage(err, 'Error al actualizar la publicación.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchRealEstateData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchRealEstateData]);

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
    handleDeleteListing,
    handleUpdateListing,
    isSubmitting,
    formError,
    formSuccess,
  };
};