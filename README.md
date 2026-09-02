# Pulso

Tu agenda, llevada a la realidad.

PWA sobre Google Calendar — ver eventos, marcar hechos, mover, subtareas, cierre del día.

## Stack

- React + TypeScript + Vite
- Firebase (Auth + Firestore)
- Google Calendar API
- PWA (vite-plugin-pwa)

## Setup

```bash
cp .env.example .env
# Completar credenciales Firebase y Google Client ID
npm install
npm run dev
```

## Variables de entorno

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GOOGLE_CLIENT_ID=
VITE_AI_ENABLED=false
```

## Deploy

```bash
npm run build
# Firebase Hosting:
firebase deploy --only hosting
# O Vercel: importar repo y apuntar a dist/
```
