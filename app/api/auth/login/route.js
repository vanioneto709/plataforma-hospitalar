// app/auth/login/page.js
'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
// 👈 Importamos o useRouter para navegação
import { useRouter } from 'next/navigation'; 

export default function LoginPage() {
  const router = useRouter(); // 👈 Inicializa o router
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Login realizado com sucesso! Redirecionando...');
        
        // 1. O Token (código de permissão) é salvo aqui!
        // Isso permite que o sistema saiba quem é o usuário em todas as páginas
        localStorage.setItem('auth_token', data.token);
        
        // 2. Armazenamos dados básicos do usuário (para mostrar nome no topo, por exemplo)
        localStorage.setItem('user_data', JSON.stringify(data.user)); 
        
        // 3. Redireciona o usuário para o Painel principal
        router.push('/dashboard'); 
        
      } else {
        setMessage(`❌ Falha no login: ${data.message || 'Credenciais inválidas.'}`);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setMessage('❌ Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estrutura visual (restante do código JSX é o mesmo)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Acesso à Plataforma
        </h1>
        <p className="text-center text-gray-600">
          Entre com seu e-mail e senha de Gestor, Médico ou Recepção.
        </p>

        {message && (
          <div className={`p-3 rounded text-sm ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="seu.email@clinica.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-md transition ${isLoading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Não tem uma conta de clínica? 
          <Link href="/cadastro-clinica" className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
            Cadastre sua Clínica aqui.
          </Link>
        </p>
      </div>
    </div>
  );
}