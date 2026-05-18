"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import Image from "next/image";

const accepted = "image/png,image/jpeg,image/webp";

type ImageKey = "image1" | "image2" | "image3";

export function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState<Record<ImageKey, File | null>>({ image1: null, image2: null, image3: null });

  const previews = useMemo(
    () => ({
      image1: images.image1 ? URL.createObjectURL(images.image1) : "",
      image2: images.image2 ? URL.createObjectURL(images.image2) : "",
      image3: images.image3 ? URL.createObjectURL(images.image3) : "",
    }),
    [images],
  );

  function onPickImage(key: ImageKey, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImages((prev) => ({ ...prev, [key]: file }));
  }

  async function submitForm(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");

    if (images.image1) formData.append("image1", images.image1);
    if (images.image2) formData.append("image2", images.image2);
    if (images.image3) formData.append("image3", images.image3);

    const response = await fetch("/api/register", { method: "POST", body: formData });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "No se pudo completar el registro.");
      setLoading(false);
      // ensure user sees the error message on mobile
      setTimeout(() => {
        const el = document.getElementById("registration-form");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }

    setSuccess("Registro completado. Revisa tu correo cuando se realice el sorteo.");
    setImages({ image1: null, image2: null, image3: null });
    setLoading(false);
    const form = document.getElementById("registration-form") as HTMLFormElement | null;
    form?.reset();
    // scroll to show success message on small screens
    setTimeout(() => {
      const el = document.getElementById("registration-form");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // ensure HTML5 validation messages are shown on mobile
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const fd = new FormData(formEl);
    submitForm(fd);
  }

  return (
    <form id="registration-form" onSubmit={handleSubmit} className="card form-appear space-y-4">
      <h2 className="text-2xl font-semibold text-white">Registro de Participante</h2>
      <input name="fullName" required minLength={3} maxLength={100} placeholder="Nombre completo" className="field" />
      <input name="email" required type="email" placeholder="Correo electronico" className="field" />
      <textarea
        name="avoidList"
        required
        minLength={2}
        maxLength={1200}
        rows={4}
        placeholder="Camisetas/equipos que NO quieres recibir"
        className="field"
      />

      <div className="grid gap-3 md:grid-cols-3">
        {([
          ["image1", "Imagen Top 1"],
          ["image2", "Imagen Top 2"],
          ["image3", "Imagen Top 3"],
        ] as const).map(([key, label]) => (
          <label key={key} className="upload-zone min-h-28 flex-col items-start justify-start">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-300" />
              <span>{label}</span>
            </div>
            <span className="text-xs text-zinc-400">JPG, PNG o WEBP</span>
            <input type="file" accept={accepted} onChange={(e) => onPickImage(key, e)} className="hidden" />
            {previews[key] ? (
              <Image src={previews[key]} alt={label} width={240} height={120} unoptimized className="mt-2 h-24 w-full rounded-lg object-cover" />
            ) : (
              <div className="mt-2 h-24 w-full rounded-lg border border-white/10 bg-black/20" />
            )}
          </label>
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar Registro"}
      </button>

      {success && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-emerald-200">
          <CheckCircle2 className="h-5 w-5" />
          {success}
        </p>
      )}
      {error && <p className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-red-200">{error}</p>}
    </form>
  );
}
