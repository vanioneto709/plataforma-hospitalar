// app/cadastro-clinica/page.js
'use client'; // Indica que este componente deve ser renderizado no navegador

import React, { useState } from 'react';

export default function CadastroClinicaPage() {
  // Estado (State) para armazenar o que o usuário digita nos campos
  const [formData, setFormData] = useState({
    clinicaNome: '',
    clinicaEmail: '',
    clinicaTelefone: '',
    clinicaEndereco: '',
    gestorNome: '',
    gestorEmail: '',
    gestorPassword: '',
    confirmPassword: '', // Apenas para validação no Frontend
  });

  // Estados para feedback visual
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Função para atualizar o estado sempre que um campo muda
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 2. Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // ⚠️ Validação no Frontend: Senhas iguais?
    if (formData.gestorPassword !== formData.confirmPassword) {
      setMessage('As senhas não coincidem!');
      return; // Para a função aqui
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 3. Chamada à API: Enviando os dados para o seu route.js
      const response = await fetch('/api/cadastro-clinica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia todos os dados que o usuário digitou
       body: JSON.stringify({
  nomeClinica: formData.clinicaNome,
  endereco: formData.clinicaEndereco,
  telefone: formData.clinicaTelefone,
  email: formData.gestorEmail,
  senha: formData.gestorPassword
}),
 
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso: Limpa o formulário e mostra mensagem
        setMessage(`✅ ${data.message} Agora você pode acessar a página de login.`);
        // Reiniciar o formulário após o sucesso
        setFormData({ /* ... (limpar campos) */ }); 
      } else {
        // Erro da API (ex: email já existe)
        setMessage(` Erro no cadastro: ${data.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      setMessage(' Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 4. Estrutura Visual do Formulário (Com classes CSS simples)
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Cadastro da sua Clínica
      </h1>
      <p className="mb-6 text-gray-600">
        Preencha os dados da sua clínica e crie a conta do primeiro Gestor.
      </p>

      {/* Área de Feedback */}
      {message && (
        <div className={`p-3 mb-4 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === SEÇÃO: DADOS DA CLÍNICA === */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Detalhes da Clínica</h2>
          
          {/* Inputs de clínica */}
          <input type="text" name="clinicaNome" placeholder="Nome Completo da Clínica *" value={formData.clinicaNome} onChange={handleChange} required className="p-3 border rounded w-full mb-3" />
          <input type="email" name="clinicaEmail" placeholder="E-mail da Clínica" value={formData.clinicaEmail} onChange={handleChange} className="p-3 border rounded w-full mb-3" />
          <input type="text" name="clinicaTelefone" placeholder="Telefone" value={formData.clinicaTelefone} onChange={handleChange} className="p-3 border rounded w-full mb-3" />
          <input type="text" name="clinicaEndereco" placeholder="Endereço Principal" value={formData.clinicaEndereco} onChange={handleChange} className="p-3 border rounded w-full" />
        </div>

        {/* === SEÇÃO: DADOS DO GESTOR === */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Detalhes do Gestor/Diretor</h2>
          
          {/* Inputs de usuário */}
          <input type="text" name="gestorNome" placeholder="Seu Nome Completo *" value={formData.gestorNome} onChange={handleChange} required className="p-3 border rounded w-full mb-3" />
          <input type="email" name="gestorEmail" placeholder="Seu E-mail (Será o login) *" value={formData.gestorEmail} onChange={handleChange} required className="p-3 border rounded w-full mb-3" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" name="gestorPassword" placeholder="Senha *" value={formData.gestorPassword} onChange={handleChange} required className="p-3 border rounded w-full" />
            <input type="password" name="confirmPassword" placeholder="Confirme a Senha *" value={formData.confirmPassword} onChange={handleChange} required className="p-3 border rounded w-full" />
          </div>
        </div>

        {/* === BOTÃO DE ENVIO === */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full px-4 py-3 font-bold text-white rounded transition ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isLoading ? 'Cadastrando...' : 'Concluir Cadastro'}
        </button>
      </form>
    </div>
  );
}