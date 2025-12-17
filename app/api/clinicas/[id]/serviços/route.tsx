// app/api/clinicas/[id]/servicos/route.js
import { NextResponse } from 'next/server';

// MOCK dos serviços (igual ao que você tinha no front)
const MOCK_SERVICES = {
    'cli1': [
        { id: 101, nome: "Consulta Odontológica", duracao_minutos: 60, preco: 150 },
        { id: 102, nome: "Limpeza Dental", duracao_minutos: 30, preco: 80 }
    ],
    'cli2': [
        { id: 201, nome: "Primeira Avaliação", duracao_minutos: 90, preco: 200 },
        { id: 202, nome: "Sessão de Fisioterapia", duracao_minutos: 60, preco: 120 }
    ],
    'cli3': [
        { id: 301, nome: "Check-up Médico", duracao_minutos: 45, preco: 180 },
        { id: 302, nome: "Aconselhamento Nutricional", duracao_minutos: 60, preco: 100 }
    ]
};

export async function GET(req, { params }) {
    const clinicId = params.id; // pega o id da clínica da URL
    const services = MOCK_SERVICES[clinicId] || [];
    
    return NextResponse.json(services);
}

