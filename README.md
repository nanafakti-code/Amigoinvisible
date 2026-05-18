# Amigo Invisible Futbol

Web moderna para organizar un amigo invisible de camisetas de futbol con Next.js, Supabase y NodeMailer.

## Stack
- Next.js 16 + TypeScript + TailwindCSS
- Supabase (PostgreSQL) + Cloudinary (imagenes)
- API Routes en Next (backend Node.js)
- NodeMailer con Gmail SMTP
- Framer Motion + Lucide Icons

## Funcionalidades
- Registro de usuarios con nombre, email, top 3 camisetas, lista de "no quiero".
- Subida de hasta 3 imagenes (JPG/PNG/WEBP) con vista previa.
- Anti-duplicados por email.
- Fecha limite de sorteo configurable.
- Panel admin privado con clave por header.
- Dashboard visual de participantes y estado de sorteo.
- Sorteo automatico sin autoasignaciones.
- Envio de correos personalizado tras el sorteo.

## Configuracion
1. Instala dependencias:
```bash
npm install
```
2. Crea `.env.local` desde `.env.example` y rellena valores.
3. En Supabase, crea bucket publico llamado `shirt-images` (o cambia `SUPABASE_BUCKET`).
4. Ejecuta SQL de `supabase/schema.sql`.

## Variables de entorno
Ver `.env.example`.

Campos clave:
- `ADMIN_SECRET_KEY`: clave del panel admin.
- `SMTP_EMAIL` y `SMTP_PASSWORD`: Gmail SMTP para correos.
- `DRAW_DEADLINE`: bloqueo del registro tras fecha limite.

## Ejecucion local
```bash
npm run dev
```
- Home: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Seguridad aplicada
- Validacion frontend y backend con Zod y reglas estrictas.
- Sanitizacion de texto de entrada.
- Restriccion de formatos y tamano de imagen.\n- Upload seguro a Cloudinary desde backend (sin exponer secretos).
- Credenciales via variables de entorno (sin hardcode).
- Endpoint admin protegido por clave secreta.
- Unicidad de email en DB.

## Despliegue en Vercel
1. Sube repo a GitHub.
2. Importa proyecto en Vercel.
3. Configura las variables de entorno de `.env.example`.
4. Ejecuta chequeo local previo:
```bash
npm run deploy:check
```

## Estructura
- `src/app/api/*`: backend y endpoints.
- `src/components/*`: UI reusable.
- `src/lib/*`: validacion, sorteo, auth, mail, supabase.
- `supabase/schema.sql`: esquema de base de datos.
- `public/mockups/*`: placeholders de camisetas.

## Notas SMTP Gmail
Si usas Gmail personal, necesitas App Password (2FA habilitado), no tu password normal.

