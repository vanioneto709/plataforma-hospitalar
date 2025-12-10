'use client';

import React, { useState, useEffect } from 'react';

// Função auxiliar para obter o nome do mês em português
const getMonthName = (date) => date.toLocaleDateString('pt-BR', { month: 'long' });
const getDayName = (date) => date.toLocaleDateString('pt-BR', { weekday: 'short' });
const formatDateKey = (date) => date.toISOString().split('T')[0]; // Formato YYYY-MM-DD

// === Componente para o Passo 1: Seleção da Clínica ===
function Step1SelectClinic({ onSelect, clinics, loading, message }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Passo 1: Escolha a Clínica</h2>
            <p className="mb-6 text-gray-500">Selecione uma das clínicas parceiras disponíveis para ver a agenda.</p>

            {loading && <p className="text-indigo-500 font-medium">Buscando clínicas...</p>}
            
            {!loading && clinics.length === 0 && <p className="text-red-500">Nenhuma clínica parceira encontrada. {message}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinics.map(clinic => (
                    <div 
                        key={clinic.id} 
                        onClick={() => onSelect(clinic)}
                        className="p-4 border border-gray-200 rounded-xl shadow-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition duration-150 transform hover:scale-[1.02]"
                    >
                        <h3 className="text-xl font-bold text-indigo-600">{clinic.nome}</h3>
                        <p className="text-sm text-gray-500 mt-1">{clinic.especialidade} | {clinic.endereco || 'Endereço não informado'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// === Componente para o Passo 2: Seleção de Serviço e Agenda ===
function Step2FullSchedule({ clinic, onBack, onCompleteBooking }) {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysInView = 14;
    const dateRange = Array.from({ length: daysInView }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    // Carrega serviços da clínica
    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            setMessage('');
            try {
                const response = await fetch(`/api/clinicas/${clinic.id}/servicos`);
                if (!response.ok) throw new Error('Erro ao buscar serviços');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                setMessage('Erro de conexão ao buscar serviços.');
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, [clinic.id]);

    // Busca horários disponíveis de um serviço em um dia
    const fetchAvailability = async (service, date) => {
        setSelectedService(service);
        setSelectedDate(date);
        setSelectedSlot(null);
        if (!service || !date) return;

        setLoading(true);
        setMessage('');
        try {
            const dateKey = formatDateKey(date);
            const res = await fetch(`/api/disponibilidade/horarios?clinicaId=${clinic.id}&servicoId=${service.id}&date=${dateKey}`);
            if (!res.ok) throw new Error('Erro ao buscar disponibilidade');
            const data = await res.json();
            setAvailability(data);
            if (data.length === 0) {
                setMessage(`Não há horários disponíveis para ${service.nome} em ${date.toLocaleDateString('pt-BR')}.`);
            }
        } catch (error) {
            setMessage('Erro de conexão ao buscar horários.');
            setAvailability([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        const bookingTime = `${formatDateKey(selectedDate)} ${slot.time}`;
        onCompleteBooking(selectedService, bookingTime, slot.professional);
    };

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center transition duration-150">
                &larr; Voltar (Escolher Outra Clínica)
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Agenda de {clinic.nome}
            </h2>

            {message && <div className="p-3 mb-4 rounded bg-yellow-100 text-yellow-700">{message}</div>}

            {loading && !services.length && <p className="text-center p-4">Carregando serviços...</p>}

            {/* 1. Seleção do Serviço */}
            <h3 className="text-xl font-semibold mb-3 text-gray-700">1. Escolha o Serviço:</h3>
            <div className="flex flex-wrap gap-3 mb-8">
                {services.map(service => (
                    <button
                        key={service.id}
                        onClick={() => fetchAvailability(service, selectedDate || today)}
                        className={`p-3 border rounded-lg transition text-sm font-medium ${selectedService?.id === service.id
                            ? 'bg-green-600 text-white border-green-700 shadow-lg transform scale-105'
                            : 'bg-white text-gray-800 hover:bg-green-50 hover:border-green-400'}`}
                    >
                        {service.nome}
                    </button>
                ))}
            </div>

            {/* 2. Visualização da Agenda/Calendário */}
            {selectedService && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">2. Escolha o Dia:</h3>
                    
                    <div className="flex overflow-x-auto pb-4 space-x-3 no-scrollbar">
                        {dateRange.map(date => {
                            const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate);
                            return (
                                <div
                                    key={formatDateKey(date)}
                                    onClick={() => fetchAvailability(selectedService, date)}
                                    className={`flex-shrink-0 w-20 p-2 text-center border rounded-lg cursor-pointer transition duration-150
                                                ${isSelected ? 'bg-indigo-600 text-white shadow-md border-indigo-700' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
                                >
                                    <div className="font-semibold text-sm">{getDayName(date)}</div>
                                    <div className="text-2xl font-bold">{date.getDate()}</div>
                                    <div className="text-xs">{getMonthName(date).substring(0, 3)}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 3. Visualização de Slots Horários */}
                    <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">3. Horários Disponíveis:</h3>
                    
                    {loading && <p className="text-center p-4 text-indigo-500">Buscando horários...</p>}

                    {!loading && availability.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {availability.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => slot.available && handleSlotSelect(slot)}
                                    disabled={!slot.available}
                                    className={`p-3 rounded-lg font-medium transition duration-150 text-sm shadow-sm
                                                ${slot.available
                                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-50 hover:ring-2 ring-blue-500'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed line-through'}`}
                                >
                                    {slot.time}
                                    <span className="block text-xs font-normal mt-1 truncate">{slot.professional}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && availability.length === 0 && !message && (
                        <p className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
                            Desculpe, não há horários vagos para o serviço e data selecionados. Tente outro dia.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// === COMPONENTE PRINCIPAL (Gerencia o Estado) ===
export default function AgendamentoPage() {
    const [step, setStep] = useState(1);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);

    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Carrega clínicas
    useEffect(() => {
        async function fetchClinics() {
            setLoading(true);
            setMessage('');
            try {
                const response = await fetch('/api/clinicas');
                if (!response.ok) throw new Error('Erro ao buscar clínicas');
                const data = await response.json();
                setClinics(data);
            } catch (error) {
                setMessage('Erro de conexão ao buscar clínicas.');
            } finally {
                setLoading(false);
            }
        }
        if (step === 1 && clinics.length === 0) fetchClinics();
    }, [step, clinics.length]);

    const handleClinicSelect = (clinic) => {
        setSelectedClinic(clinic);
        setStep(2);
    };

    const handleBookingComplete = (service, timeSlot, professional) => {
        setBookingDetails({
            clinic: selectedClinic,
            service,
            time: timeSlot,
            professional
        });
        setStep(3);
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setSelectedClinic(null);
        setBookingDetails(null);
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl my-6 md:my-10 font-sans">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
                Marcar Consulta
            </h1>

            {message && <div className="p-3 mb-4 rounded bg-red-100 text-red-700 font-medium">{message}</div>}

            {/* Indicador de Passo */}
            <div className="mb-8 flex justify-center space-x-2 text-sm font-semibold">
                <span className={`px-4 py-1 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1. Clínica</span>
                <span className={`px-4 py-1 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2. Agenda/Serviço</span>
                <span className={`px-4 py-1 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3. Confirmação</span>
            </div>

            {step === 1 && (
                <Step1SelectClinic 
                    onSelect={handleClinicSelect} 
                    clinics={clinics}
                    loading={loading}
                    message={message}
                />
            )}
            
            {step === 2 && selectedClinic && (
                <Step2FullSchedule
                    clinic={selectedClinic}
                    onBack={handleBackToStep1}
                    onCompleteBooking={handleBookingComplete}
                />
            )}
            
            {step === 3 && bookingDetails && (
                <div className="text-center p-10 border-4 border-green-400 rounded-xl bg-green-50 shadow-lg">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-green-700 mb-4">Consulta Solicitada com Sucesso!</h2>
                    
                    <div className="text-left inline-block p-4 bg-white rounded-lg border">
                        <p className="font-semibold text-gray-700 mb-2">Detalhes do Agendamento:</p>
                        <p className="text-lg">
                            <span className="font-medium text-indigo-600">{bookingDetails.service.nome}</span>
                        </p>
                        <p className="text-md mt-1">
                            Clínica: <span className="font-medium">{bookingDetails.clinic.nome}</span>
                        </p>
                        <p className="text-md mt-1">
                            Profissional: <span className="font-medium">{bookingDetails.professional}</span>
                        </p>
                        <p className="text-md mt-1">
                            Data/Hora: <span className="font-medium text-green-600">{new Date(bookingDetails.time).toLocaleDateString('pt-BR')} às {new Date(bookingDetails.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                    </div>

                    <p className="mt-5 text-green-600">
                        Você receberá a confirmação completa por e-mail em breve.
                    </p>
                    <button 
                        onClick={handleBackToStep1} 
                        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition"
                    >
                        Fazer outro agendamento
                    </button>
                </div>
            )}
        </div>
    );
}
