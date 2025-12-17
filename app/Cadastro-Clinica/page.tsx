'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormDataType {
  nomeClinica: string;
  endereco: string;
  localidade: string;
  nif: string;
  telefone: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface MessageType {
  type: 'success' | 'error';
  text: string;
}

export default function CadastroClinicaPage() {
  const [formData, setFormData] = useState<FormDataType>({
    nomeClinica: '',
    endereco: '',
    localidade: '',
    nif: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [loading, setLoading] = useState(false);

  const MessageComponent: React.FC<{ message: MessageType | null }> = ({ message }) => {
    if (!message) return null;
    return (
      <div
        className={`p-4 rounded-xl font-medium mb-6 shadow-md ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
            : 'bg-red-50 text-red-700 border-l-4 border-red-500'
        }`}
      >
        {message.text}
      </div>
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    if (file) {
      setPreviewLogo(URL.createObjectURL(file));
    } else {
      setPreviewLogo(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    const sendData = new FormData();
    sendData.append('nomeClinica', formData.nomeClinica);
    sendData.append('endereco', formData.endereco);
    sendData.append('localidade', formData.localidade);
    sendData.append('nif', formData.nif);
    sendData.append('telefone', formData.telefone);
    sendData.append('email', formData.email);
    sendData.append('senha', formData.senha);
    if (logo) sendData.append('logo', logo);

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/clinicas', {
        method: 'POST',
        body: sendData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: `Clínica "${formData.nomeClinica}" cadastrada com sucesso!` });
      setFormData({
        nomeClinica: '',
        endereco: '',
        localidade: '',
        nif: '',
        telefone: '',
        email: '',
        senha: '',
        confirmarSenha: '',
      });
      setLogo(null);
      setPreviewLogo(null);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao enviar dados para o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-3 text-center text-indigo-700">
          Cadastro de Clínica Odontológica
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Registo rápido para começar a agendar.
        </p>

        <MessageComponent message={message} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Clínica */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome da Clínica *
            </label>
            <input
              name="nomeClinica"
              value={formData.nomeClinica}
              onChange={handleChange}
              className="w-full p-3 border rounded-2xl"
              required
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Logo da Clínica
            </label>
            <input type="file" accept="image/*" onChange={handleLogoChange} placeholder="Selecione a logo da clínica" />
            {previewLogo && (
              <img src={previewLogo} alt="Preview" className="mt-3 h-20 rounded-xl shadow-md" />
            )}
          </div>

          {/* Endereço e Localidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Localidade *</label>
              <input
                name="localidade"
                value={formData.localidade}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">NIF *</label>
              <input
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
                required
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-semibold">Endereço *</label>
            <input
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-3 border rounded-2xl"
              required
            />
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Telefone</label>
              <input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Senha *</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Confirmar Senha *</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-2xl text-white font-bold ${
              loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Clínica'}
          </button>
        </form>
      </div>
    </div>
  );
}
