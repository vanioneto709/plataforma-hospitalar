// app/agendamento/page.js
'use client'; 

import React, { useState, useEffect } from 'react';

// === COMPONENTES AUXILIARES ===

// Componente para o Passo 1: Seleção da Clínica
function Step1SelectClinic({ onSelect, clinics, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Passo 1: Escolha a Clínica</h2>
      <p className="mb-6 text-gray-500">Selecione uma das clínicas parceiras para ver os serviços disponíveis.</p>

      {loading && <p className="text-blue-500">Buscando clínicas...</p>}
      
      {!loading && clinics.length === 0 && <p className="text-red-500">Nenhuma clínica parceira encontrada. Tente mais tarde.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clinics.map(clinic => (
          <div 
            key={clinic.id} 
            onClick={() => onSelect(clinic)} // 👈 Quando clicado, avança para o passo 2
            className="p-6 border border-gray-200 rounded-lg shadow-md cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition duration-150"
          >
            <h3 className="text-xl font-bold text-indigo-600">{clinic.nome}</h3>
            <p className="text-sm text-gray-500 mt-1">{clinic.endereco || 'Endereço não informado'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para o Passo 2: Seleção do Serviço
function Step2SelectService({ onSelect, clinic, services, onBack }) {
  // Simplesmente lista os serviços da clínica escolhida
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center">
        &larr; Voltar (Escolher Outra Clínica)
      </button>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Passo 2: Escolha o Serviço na {clinic.nome}</h2>
      
      <div className="space-y-3">
        {services.map(service => (
          <div 
            key={service.id} 
            onClick={() => onSelect(service)} // 👈 Quando clicado, avança para o passo 3 (Horário)
            className="p-4 border rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-400 transition"
          >
            <h3 className="text-lg font-medium text-gray-800">{service.nome}</h3>
            <p className="text-sm text-gray-500">Duração: {service.duracao_minutos} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// === COMPONENTE PRINCIPAL (Gerencia o Estado) ===
export default function AgendamentoPage() {
  const [step, setStep] = useState(1); // 1, 2, 3...
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Efeito para carregar a lista de clínicas no início (Passo 1)
  useEffect(() => {
    async function fetchClinics() {
      setLoading(true);
      try {
        // ⚠️ ATENÇÃO: A rota /api/clinicas AINDA VAI SER CRIADA!
        const response = await fetch('/api/clinicas'); 
        if (response.ok) {
          const data = await response.json();
          setClinics(data);
        } else {
          setMessage('Erro ao carregar a lista de clínicas.');
        }
      } catch (error) {
        setMessage('Erro de conexão ao buscar clínicas.');
      } finally {
        setLoading(false);
      }
    }
    
    // Só carrega se estiver no passo 1
    if (step === 1) {
      fetchClinics();
    }
  }, [step]);
  
  // 2. Função para lidar com a seleção da clínica (Avança para o Passo 2)
  const handleClinicSelect = async (clinic) => {
    setSelectedClinic(clinic);
    setLoading(true);
    setMessage('');

    try {
      // ⚠️ ATENÇÃO: A rota /api/clinicas/[id]/servicos AINDA VAI SER CRIADA!
      const response = await fetch(`/api/clinicas/${clinic.id}/servicos`); 
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
        setStep(2); // Avança
      } else {
        setMessage('Erro ao carregar serviços desta clínica.');
      }
    } catch (error) {
      setMessage('Erro de conexão ao buscar serviços.');
    } finally {
      setLoading(false);
    }
  };

  // Funções de navegação
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(3); // Avança para o Passo 3 (Seleção de Horário)
  };
  
  const handleBackToStep1 = () => {
      setStep(1);
      setSelectedClinic(null);
      setSelectedService(null);
  };
  
  const handleBackToStep2 = () => {
      setStep(2);
      setSelectedService(null);
  };


  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-xl my-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Marcar Consulta
      </h1>
      
      {message && <div className="p-3 mb-4 rounded bg-red-100 text-red-700">{message}</div>}

      {/* Renderiza o componente baseado no passo atual */}
      {step === 1 && (
        <Step1SelectClinic 
          onSelect={handleClinicSelect} 
          clinics={clinics}
          loading={loading}
        />
      )}
      
      {step === 2 && selectedClinic && (
        <Step2SelectService 
          onSelect={handleServiceSelect}
          onBack={handleBackToStep1}
          clinic={selectedClinic}
          services={services}
        />
      )}
      
      {/* Esqueleto para os Próximos Passos */}
      {step === 3 && selectedService && (
        <div>
          <button onClick={handleBackToStep2} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center">
            &larr; Voltar (Escolher Outro Serviço)
          </button>
          <h2 className="text-2xl font-semibold text-gray-700">Passo 3: Escolha o Profissional e Horário</h2>
          <p className="mt-2 text-gray-500">Agendamento para **{selectedService.nome}** na clínica **{selectedClinic.nome}**.</p>
          
          <div className="mt-6 p-6 border rounded bg-yellow-50">
             {/* ⚠️ AQUI ENTRARÁ O CÓDIGO DA AGENDA! */}
             <p>Aqui você verá a lista de Médicos/Dentistas e a disponibilidade de horários.</p>
             <p className="text-sm mt-2">Próxima API a ser criada: `/api/agendamentos/disponibilidade`</p>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="text-center p-10 border rounded-lg bg-green-100">
          <h2 className="text-3xl font-bold text-green-700">🎉 Consulta Solicitada!</h2>
          <p className="mt-3 text-green-600">Obrigado! Você receberá a confirmação por e-mail em breve.</p>
          <button onClick={handleBackToStep1} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded">
            Fazer outro agendamento
          </button>
        </div>
      )}
    </div>
  );
}