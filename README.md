# Pulso

Tu agenda, llevada a la realidad.

PWA sobre Google Calendar — ver eventos, marcar hechos, mover, subtareas, cierre del día.

## Stack

- React + TypeScript + Vite
- Firebase (Auth + Firestore)
- Google Calendar API
- PWA

## Deploy

[https://pulso.gaufgang.com](https://pulso.gaufgang.com)

## Desarrollo

```bash
cp .env.example .env
# Completar credenciales Firebase + Google OAuth
npm install
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | API Key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth Domain de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | Project ID de Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_AI_ENABLED` | `true` / `false` — sugerencias IA |
| `VITE_AI_API_KEY` | API key del proveedor IA (opcional) |

## Cómo funciona

1. Conectás tu cuenta Google
2. Pulso carga tus eventos del día desde Google Calendar
3. Marcás hechos, movés, dividís en subtareas
4. Al final del día, decidís qué hacer con lo que quedó pendiente

**Google Calendar sigue siendo la fuente de verdad.** Pulso agrega una capa de ejecución encima.
