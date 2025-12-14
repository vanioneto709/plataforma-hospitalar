// app/page.js ou app/page.tsx

import Link from 'next/link';
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

// Componentes Reutilizáveis de Ícone
const IconHeart: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
  </svg>
);

/** @type {React.FC<IconProps>} */
const IconCalendar = (props: IconProps) => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

/** @type {React.FC<IconProps>} */
const IconNetwork = (props: IconProps) => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* CORRIGIDO: strokeLinelinejoin -> strokeLinejoin */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);


export default function HomePage() {
  return (
    <div className="text-text-dark antialiased bg-background min-h-screen">
      
      {/* 1. Header (Cabeçalho/Navegação) */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary flex items-center">
            <IconHeart />
            Saúde Conecta
          </Link>
          
          {/* Menu de Navegação */}
          <nav className="hidden md:flex space-x-8">
            <a href="#hero" className="text-text-dark hover:text-primary transition duration-150">Home</a>
            <a href="#funcionalidades" className="text-text-dark hover:text-primary transition duration-150">Diferenciais</a>
            <a href="#parceiros" className="text-text-dark hover:text-primary transition duration-150">Rede</a>
          </nav>

          {/* Botão de Ação Principal (CTA) */}
          <Link href="/login" className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300">
            Acessar Minha Conta
          </Link>
        </div>
      </header>

      <main>
        {/* 2. Seção Hero (Apresentação Principal) */}
        <section id="hero" className="pt-16 pb-20 md:pt-24 md:pb-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            
            {/* Texto Principal e CTAs */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-text-dark">
                Sua Saúde em Suas Mãos. <span className="text-primary">Agendamento Transparente.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                A solução web SaaS leve, funcional e já pensada para crescer, permitindo gestão de agendas e prontuários básicos. Encontre horários livres, marque consultas e conecte-se à rede parceira.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* CTA 1: Marcar Consulta (Paciente) */}
                <Link 
                  href="/agendamento" 
                  className="inline-block bg-secondary hover:bg-teal-500 text-white font-bold text-xl py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105 text-center"
                >
                  Marcar uma Consulta
                </Link>
                
                {/* CTA 2: Cadastro de Clínica (Gestor) */}
                <Link 
                  href="/Cadastro-Clinica" 
                  className="inline-block bg-primary hover:bg-blue-700 text-white font-bold text-xl py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105 text-center"
                >
                  Cadastrar Clínica
                </Link>
              </div>
            </div>

            {/* Elemento Visual (Placeholder de Imagem) */}
            <div className="hidden md:block">
              {/* O ideal seria usar o componente <Image /> do Next.js */}
              <img 
                src="https://placehold.co/600x400/1D4ED8/ffffff?text=Interface+Simples+%26+Moderna"
                alt="Interface digital moderna de agendamento médico"
                className="rounded-xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* 3. Seção: Nossos Diferenciais (Funcionalidades) */}
        <section id="funcionalidades" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-text-dark mb-12">O Futuro da Saúde Conectada</h2>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Card 1: Agendamento Zappy */}
              <div className="bg-white p-8 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
                <div className="text-secondary mb-4">
                  <IconCalendar />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark mb-3">Agendamento Zappy: Veja e Marque na Hora!</h3>
                <p className="text-gray-600">
                  Esqueça a espera. Filtre por especialidade ou clínica, veja a agenda atualizada dos médicos em tempo real e garanta seu horário instantaneamente, 24 horas por dia.
                </p>
              </div>

              {/* Card 2: Rede Hospitalar Conectada (Intracomunicação) */}
              <div className="bg-white p-8 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
                <div className="text-primary mb-4">
                  <IconNetwork />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark mb-3">Rede Conectada e Encaminhamento Seguro</h3>
                <p className="text-gray-600">
                  Nossa plataforma conecta clínicas parceiras (Intracomunicação) através de um sistema de referências e "Caixa de Entrada" assíncrona, facilitando a troca segura de prontuários, segundas opiniões e encaminhamento de pacientes.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Seção: Clínicas Parceiras (Credibilidade) */}
        <section id="parceiros" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text-dark mb-8">Nossa Rede de Excelência</h2>
            <p className="text-gray-600 mb-12">Unidades que confiam na nossa plataforma para otimizar o atendimento e a comunicação.</p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {/* Exemplo de Clínicas (Baseado na tabela Clinicas da modelagem) */}
              <div className="text-2xl font-extrabold text-gray-500 opacity-80 hover:opacity-100 transition duration-300">
                Clínica SSorrisos <span className="text-primary">+</span>
              </div>
              <div className="text-2xl font-extrabold text-gray-500 opacity-80 hover:opacity-100 transition duration-300">
                Clínica Somar Sorrisos <span className="text-secondary">(Brevemente)</span>
              </div>
              <div className="text-2xl font-extrabold text-gray-500 opacity-80 hover:opacity-100 transition duration-300">
                FarmaCabenda <span className="text-primary">(Brevemente)</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 5. Footer (Rodapé) */}
      <footer id="contato" className="bg-gray-800 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:flex md:justify-between md:items-center">
          
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-primary mb-2">Saúde Conecta</h3>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/termos" className="text-gray-400 hover:text-white transition duration-150">Termos de Uso</a>
            <a href="/privacidade" className="text-gray-400 hover:text-white transition duration-150">Política de Privacidade</a>
            <Link href="/parceiro" className="text-secondary hover:text-white font-semibold transition duration-150">Área do Parceiro</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}