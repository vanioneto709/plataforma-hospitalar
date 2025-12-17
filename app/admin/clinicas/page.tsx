'use client';

import { useEffect, useState } from 'react';

interface Clinica {
  id: number;
  nome: string;
  endereco: string;
  [key: string]: any; // caso tenha mais campos
}

export default function ClinicasAdmin() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);

  useEffect(() => {
    fetch('/api/admin/clinicas', {
      headers: { authorization: 'meu_token_super_admin' },
    })
      .then(res => res.json())
      .then((data: Clinica[]) => setClinicas(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clínicas</h1>
      <ul>
        {clinicas.map(c => (
          <li key={c.id} className="mb-2">
            {c.nome} - {c.endereco}
          </li>
        ))}
      </ul>
    </div>
  );
}
