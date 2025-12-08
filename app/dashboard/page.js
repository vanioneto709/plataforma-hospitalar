// app/dashboard/page.js
'use client'; 

import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os dados do usuário ao entrar na página
  useEffect(() => {
    // Leitura dos dados que foram salvos no login
    const storedData = localStorage.getItem('user_data');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando Painel...</div>;
  }
  
  // Se não houver dados (algo deu errado ou o middleware falhou)
  if (!userData) {
      return <div className="p-8 text-center text-red-500">Erro: Dados do usuário não encontrados. Faça login novamente.</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          Bem-vindo, {userData.nome}!
        </h1>
        <p className="text-lg text-gray-600">
          Painel de Gestão da {userData.clinicName} | Função: {userData.role}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartão 1: Agenda */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🗓️ Agenda de Hoje</h2>
          <p className="text-gray-500">Gerencie suas consultas e horários.</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">Ver Agenda Completa</button>
        </div>
        
        {/* Cartão 2: Pacientes */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🧑‍🤝‍🧑 Gestão de Pacientes</h2>
          <p className="text-gray-500">Cadastre e busque prontuários.</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">Lista de Pacientes</button>
        </div>
        
        {/* Cartão 3: Serviços */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">🦷 Serviços</h2>
          <p className="text-gray-500">Edite serviços e preços da clínica.</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">Gerenciar Serviços</button>
        </div>
      </div>
      
      <footer className="mt-10 pt-4 border-t text-center text-sm text-gray-500">
        Próximo passo: Conectar o calendário!
      </footer>
    </div>
  );
}