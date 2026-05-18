import Image from "next/image";
import { RegistrationForm } from "@/components/registration-form";

export default function Home() {
  return (
    <main className="container-app space-y-8 py-10">
      <section className="hero">
        <p className="badge">Amigo Invisible Futbol</p>
        <h1 className="text-4xl font-bold text-white md:text-6xl">Organiza tu sorteo de camisetas como una app profesional</h1>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <aside className="card space-y-4 order-first lg:order-2">
          <h2 className="text-2xl font-semibold text-white">Instrucciones Rapidas</h2>
          <ul className="space-y-2 text-zinc-200">
            <li>1. Completa nombre y email.</li>
            <li>2. Adjunta hasta 3 imagenes de las camisetas que quieres.</li>
            <li>3. Indica claramente lo que no quieres recibir.</li>
            <li>4. Espera al sorteo oficial desde el panel admin.</li>
          </ul>
          <div className="grid grid-cols-3 gap-2">
            <Image src="/mockups/shirt-1.svg" alt="placeholder camiseta" width={300} height={220} className="rounded-lg" />
            <Image src="/mockups/shirt-2.svg" alt="placeholder camiseta" width={300} height={220} className="rounded-lg" />
            <Image src="/mockups/shirt-3.svg" alt="placeholder camiseta" width={300} height={220} className="rounded-lg" />
          </div>
        </aside>
        <RegistrationForm />
      </section>
    </main>
  );
}
