"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Trophy, Trash2 } from "lucide-react";
import Image from "next/image";

type Participant = {
  id: string;
  full_name: string;
  email: string;
  favorites: string[];
  avoid_list: string;
  image_urls: string[];
};

export function AdminPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<{ participantsCount: number; drawDone: boolean } | null>(null);

  async function fetchData(key: string) {
    setLoading(true);
    setMessage("");

    const [pRes, sRes] = await Promise.all([
      fetch("/api/admin/participants", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/stats", { headers: { "x-admin-key": key } }),
    ]);

    if (pRes.status === 401 || sRes.status === 401) {
      setMessage("Clave de administrador incorrecta.");
      setLoading(false);
      return;
    }

    if (!pRes.ok || !sRes.ok) {
      let detail = "Error interno cargando el panel.";
      try {
        const body = await pRes.json();
        if (body?.error) detail = body.error;
      } catch {}
      setMessage(`${detail} Revisa que las tablas de Supabase esten creadas.`);
      setLoading(false);
      return;
    }

    const pJson = await pRes.json();
    const sJson = await sRes.json();
    setParticipants(pJson.participants);
    setStats(sJson);
    setMessage("Panel cargado correctamente.");
    setLoading(false);
  }

  async function deleteParticipant(id: string) {
    if (!confirm("¿Eliminar participante? Esto no se puede deshacer.")) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/participants", {
        method: "DELETE",
        headers: { "x-admin-key": adminKey.trim(), "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "No se pudo eliminar el participante.");
      } else {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        setMessage("Participante eliminado.");
        setStats((s) => (s ? { ...s, participantsCount: Math.max(0, s.participantsCount - 1) } : s));
      }
    } catch (e) {
      setMessage("Error de red eliminando participante.");
    }

    setLoading(false);
  }

  return (
    <div className="card space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
        <ShieldCheck className="h-6 w-6 text-emerald-300" />
        Panel de Administrador
      </h2>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="password"
          placeholder="Clave admin"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="field"
        />
        <button onClick={() => fetchData(adminKey.trim())} className="btn-primary" disabled={loading || !adminKey}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar"}
        </button>
      </div>

      {stats && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="glass p-4">
            <p className="text-sm text-zinc-300">Participantes registrados</p>
            <p className="text-3xl font-bold text-white">{stats.participantsCount}</p>
          </div>
          <div className="glass p-4">
            <p className="text-sm text-zinc-300">Estado sorteo</p>
            <p className="text-3xl font-bold text-white">{stats.drawDone ? "Realizado" : "Pendiente"}</p>
          </div>
        </div>
      )}

      <button
        disabled={!adminKey || loading || participants.length < 2}
        className="btn-primary w-full"
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/admin/draw", { method: "POST", headers: { "x-admin-key": adminKey.trim() } });
          const data = await res.json();
          setLoading(false);
          setMessage(res.ok ? `Sorteo completado. Correos enviados: ${data.assignments}` : data.error || "Error en el sorteo.");
          if (res.ok) fetchData(adminKey.trim());
        }}
      >
        <Trophy className="h-5 w-5" /> Realizar sorteo
      </button>

      {message && <p className="rounded-xl bg-white/5 p-3 text-sm text-zinc-200">{message}</p>}

      <div className="space-y-3">
        {participants.map((p) => (
          <article key={p.id} className="glass p-4">
            <h3 className="text-lg font-semibold text-white">{p.full_name}</h3>
            <p className="text-sm text-zinc-300">{p.email}</p>
            <p className="mt-2 text-sm text-zinc-200">Top 3: {p.favorites.join(" | ")}</p>
            <p className="mt-2 text-sm text-zinc-200">No quiere: {p.avoid_list}</p>
            {p.image_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {p.image_urls.map((url) => (
                  <Image key={url} src={url} width={200} height={100} className="h-20 w-full rounded-lg object-cover" alt="camiseta" />
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => deleteParticipant(p.id)}
                className="btn-primary bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
