// app/api/auth/login/route.ts
import { adminAuth } from "@/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { syncUserToDB } from "@/app/lib/syncUserToDb";

export async function POST(req: Request) {
  const { idToken } = await req.json();
  try {
    // Verify the ID token using the initialized Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };

    // Sync the user to MongoDB
    const user = await syncUserToDB(firebaseUser);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token or syncing user:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
