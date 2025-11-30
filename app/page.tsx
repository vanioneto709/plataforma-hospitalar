// app/page.tsx - A página inicial

// Importar React é opcional no Next.js moderno, mas mantém a clareza
import React from 'react';

// Este é o código do componente React que representa a sua página.
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        Clínica Inteligente (Multi-Clínica)
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Bem-vindo(a)! Escolha uma clínica para agendar o seu serviço.
      </p>
      
      {/* Botões/Links que vamos implementar a seguir */}
      <div className="space-x-4">
        <a href="/clinicas/ssorrisos" className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
          Clínica Ssorrisos
        </a>
        <a href="/clinicas/somarsorriso" className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
          Clínica Somar Sorriso
        </a>
      </div>

      <p className="mt-10 text-sm text-gray-400">
        Status: Frontend ativo. Base de dados pronta.
      </p>
    </div>
  )
}