// // lib/firebase-admin.ts
// import admin from "firebase-admin";

// export function initializeAdmin() {
//   if (admin.apps.length === 0) {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//       }),
//     });
//   }
// }

// // In protected API routes:
// // import { initializeAdmin } from "@app/lib/firebase-admin";

// // export async function GET(req: Request) {
// //   initializeAdmin();
// //   // protected route logic
// // }
