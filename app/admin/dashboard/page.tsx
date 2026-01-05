"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Clinica = {
  id: number;
  nome: string;
  endereco: string;
  localidade: string;
  status: boolean;
  logo_url?: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Proteção da rota (Admin)
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchClinicas();
  }, []);

  // ==========================
  // Buscar clínicas
  // ==========================
  const fetchClinicas = async () => {
    try {
      const res = await fetch("/api/admin/clinicas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao carregar clínicas.");
        return;
      }

      setClinicas(data);
    } catch {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Apagar clínica
  // ==========================
  const deleteClinica = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar esta clínica?")) return;

    await fetch(`/api/admin/clinicas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    setClinicas((prev) => prev.filter((c) => c.id !== id));
  };

  // ==========================
  // UI
  // ==========================
  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Super Admin</h1>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Localidade</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clinicas.map((clinica) => (
              <tr key={clinica.id} className="border-t">
                <td className="p-3">
                  {clinica.logo_url ? (
                    <img
                      src={clinica.logo_url}
                      alt="Logo"
                      className="h-10 rounded"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">{clinica.nome}</td>
                <td className="p-3">{clinica.localidade}</td>
                <td className="p-3">
                  {clinica.status ? "Ativa" : "Inativa"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteClinica(clinica.id)}
                    className="text-red-600 hover:underline"
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clinicas.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            Nenhuma clínica cadastrada.
          </p>
        )}
      </div>
    </div>
  );
}
