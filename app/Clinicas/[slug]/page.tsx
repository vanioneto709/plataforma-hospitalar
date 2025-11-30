// app/clinicas/[slug]/page.tsx

import React from 'react';

// Define a estrutura das propriedades que a página vai receber (o slug da URL)
interface ClinicPageProps {
  params: {
    slug: string; // Ex: 'ssorrisos' ou 'somarsorriso'
  };
}

// Este componente recebe o nome da clínica (slug) através da URL
export default function ClinicPage({ params }: ClinicPageProps) {
  // params.slug será 'ssorrisos' ou 'somarsorriso'
  // Formata a string para exibir com a primeira letra em maiúscula
  const nomeClinica = params.slug.replace(/s$/, '').replace(/^\w/, c => c.toUpperCase()); 

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-4">
        Página de Agendamento - {nomeClinica}
      </h1>
      <p className="text-gray-600 mb-8">
        Esta é a página individual da clínica. Em breve, mostraremos os serviços e médicos daqui.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
        <p className="font-bold">Em Desenvolvimento</p>
        <p>A URL atual é: <strong>/clinicas/{params.slug}</strong>. O sistema de rotas dinâmicas do Next.js está a funcionar!</p>
      </div>

      <a href="/" className="mt-8 inline-block text-sm text-indigo-500 hover:text-indigo-700">
        ← Voltar à Home
      </a>
    </div>
  )
}