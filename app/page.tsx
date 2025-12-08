// app/page.js (Página Inicial)
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      
      {/* 🚀 Seção de Apresentação e Visão Geral */}
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Plataforma Inteligente de Gestão Hospitalar
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A solução web SaaS leve, funcional e já pensada para crescer, 
          permitindo gestão de agendas e prontuários básicos[cite: 5, 3].
        </p>
        
        {/* Espaço para Imagem de Apresentação (Seu "Showcase") */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 border border-gray-200">
             {/* Substitua esta div pela sua imagem/vídeo da plataforma */}
             <div className="h-64 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                [Espaço para Imagem/Mockup da Plataforma]
             </div>
        </div>
      </header>

      {/* 🎯 Seção de Ação (Com os botões solicitados) */}
      <section className="py-12 px-4 bg-white w-full">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center gap-6">
          
          {/* Botão 1: Marcar Consulta (Leva para a escolha de clínica) */}
          <Link 
            href="/agendamento" 
            className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg text-center
                       bg-blue-600 hover:bg-blue-700 text-white transition duration-300"
          >
            🗓️ Marcar Consulta (Sou Paciente)
          </Link>
          
          {/* Botão 2: Cadastro de Clínica (Leva para o registro da clínica/gestor) */}
          <Link 
            href="/cadastro-clinica" 
            className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg text-center
                       bg-green-600 hover:bg-green-700 text-white transition duration-300"
          >
            🏥 Cadastrar Clínica (Sou Gestor)
          </Link>
          
        </div>
      </section>
      
      {/* ... Aqui você pode adicionar mais seções, como Pontos-chave[cite: 7], Testemunhos, etc. */}

    </div>
  );
}