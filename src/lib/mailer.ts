import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { Participant } from "@/types/participant";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.required("SMTP_EMAIL"),
      pass: env.required("SMTP_PASSWORD"),
    },
  });
}

function renderFavoriteImages(imageUrls: string[]): string {
  const slots = [0, 1, 2].map((index) => imageUrls[index] || "");

  return slots
    .map((url, idx) => {
      if (!url) {
        return `
          <div style="background:#111a24;border:1px solid #233041;border-radius:12px;padding:14px;text-align:center;color:#92a2b5;">
            Imagen ${idx + 1} no adjuntada
          </div>
        `;
      }

      return `
        <div style="background:#0e1720;border:1px solid #1f3145;border-radius:12px;padding:10px;">
          <img src="${url}" alt="Camiseta favorita ${idx + 1}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;display:block;" />
        </div>
      `;
    })
    .join("");
}

export async function sendDrawEmail(giver: Participant, target: Participant): Promise<void> {
  const transporter = createTransporter();
  const imageGrid = renderFavoriteImages(target.image_urls);

  await transporter.sendMail({
    from: `\"Amigo Invisible Futbol\" <${env.required("SMTP_EMAIL")}>`,
    to: giver.email,
    subject: "Asignacion oficial del Amigo Invisible de camisetas",
    html: `
      <div style="margin:0;padding:24px;background:#060b12;font-family:Inter,Segoe UI,Arial,sans-serif;color:#dce7f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px;margin:0 auto;background:linear-gradient(145deg,#0f1a27,#101f1b);border:1px solid #1f3a3a;border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 10px 28px;">
              <div style="display:inline-block;padding:6px 12px;border:1px solid #2ee58d66;border-radius:999px;color:#8efcc8;font-size:12px;letter-spacing:.4px;">
                COMUNICACION OFICIAL
              </div>
              <h1 style="margin:14px 0 6px 0;font-size:26px;line-height:1.2;color:#ffffff;">
                Sorteo confirmado
              </h1>
              <p style="margin:0;color:#b5c4d8;font-size:15px;line-height:1.6;">
                Hola ${giver.full_name}, ya tienes asignacion para el intercambio de camisetas.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 28px 0 28px;">
              <div style="background:#0c1420;border:1px solid #1d3042;border-radius:12px;padding:14px 16px;">
                <p style="margin:0;font-size:13px;color:#94a9c5;">Participante asignado</p>
                <p style="margin:6px 0 0 0;font-size:20px;color:#ffffff;font-weight:600;">${target.full_name}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px 0 28px;">
              <p style="margin:0 0 10px 0;font-size:14px;color:#b8c8dd;">Imagenes de camisetas favoritas adjuntadas por el participante:</p>
              <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">
                ${imageGrid}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px 0 28px;">
              <div style="background:#11131b;border:1px solid #2f3745;border-radius:12px;padding:14px;">
                <p style="margin:0 0 6px 0;color:#9ab0cb;font-size:13px;">No desea recibir</p>
                <p style="margin:0;color:#ffffff;font-size:14px;line-height:1.6;">${target.avoid_list.replace(/\n/g, "<br/>")}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 28px 28px;">
              <p style="margin:0;color:#7f93ad;font-size:12px;line-height:1.6;">
                Mensaje generado automaticamente por la plataforma Amigo Invisible Futbol.
                Mantén la asignacion en privado hasta la fecha acordada.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}
