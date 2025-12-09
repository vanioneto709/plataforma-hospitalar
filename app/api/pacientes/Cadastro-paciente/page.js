'use client';

import { useState } from 'react';

export default function CadastroPaciente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmPassword: '',
    telefone: '',
    data_nascimento: '',
    genero: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.senha !== formData.confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone,
          data_nascimento: formData.data_nascimento,
          genero: formData.genero,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setFormData({ nome: '', email: '', senha: '', confirmPassword: '', telefone: '', data_nascimento: '', genero: '' });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Paciente</h1>

      {message && <p className={`mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required className="p-2 border rounded" />
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required className="p-2 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirme a senha" value={formData.confirmPassword} onChange={handleChange} required className="p-2 border rounded" />
        <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required className="p-2 border rounded" />
        <input type="date" name="data_nascimento" placeholder="Data de nascimento" value={formData.data_nascimento} onChange={handleChange} className="p-2 border rounded" />
        <select name="genero" value={formData.genero} onChange={handleChange} className="p-2 border rounded">
          <option value="">Gênero</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
        </select>
        <button type="submit" disabled={isLoading} className={`p-2 rounded text-white font-bold ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
