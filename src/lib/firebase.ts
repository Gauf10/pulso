import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isConfigured = !!firebaseConfig.apiKey

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null
let authReady: Promise<void> = Promise.resolve()

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager(undefined),
    }),
  })
  auth = getAuth(app)
  authReady = auth.authStateReady()
  googleProvider = new GoogleAuthProvider()
  googleProvider.addScope('https://www.googleapis.com/auth/calendar')
  googleProvider.addScope('https://www.googleapis.com/auth/calendar.events')
}

export { app, db, auth, authReady, googleProvider, isConfigured }
