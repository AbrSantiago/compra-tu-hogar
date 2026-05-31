import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { ClientCreate } from '../types/client';

export const useRegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ClientCreate>({
        name: '',
        surname: '',
        email: '',
        password: '',
    });

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);
        setIsSubmitting(true);

        if (!formData.name || !formData.surname || !formData.email || !formData.password) {
            setErrorMsg('Todos los campos son estrictamente obligatorios.');
            setIsSubmitting(false);
            return;
        }

        try {
            await authService.register(formData);
            alert('¡Registro exitoso! Ya podés iniciar sesión.');
            navigate('/login');
        } catch (error: any) {
            const backendMessage = error.response?.data?.detail;
            setErrorMsg(backendMessage || 'Error al registrar el usuario. Intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return { formData, errorMsg, isSubmitting, handleChange, handleSubmit };
};